const utils = require("./utils.js");
const sanitize = require("./sanitize");

async function migrateDAO({
  arcVersion,
  web3,
  spinner,
  confirm,
  opts,
  migrationParams,
  logTx,
  previousMigration,
  customAbisLocation,
  restart,
  getState,
  setState,
  cleanState,
  sendTx,
  getArcVersionNumber,
  optimizedAbis
}) {
  let network = await web3.eth.net.getNetworkType();
  if (network === "main") {
    network = "mainnet";
  }

  if (restart) {
    cleanState(network);
  }

  let contractsDir = "contracts";
  if (optimizedAbis) {
    contractsDir = "contracts-optimized";
  }

  let deploymentState = getState(network);

  // sanitize the parameters
  sanitize(migrationParams);

  let base = previousMigration.base;
  if (!(await confirm("About to migrate new DAO. Continue?"))) {
    return;
  }

  if (migrationParams.arcVersion !== undefined) {
    arcVersion = migrationParams.arcVersion;
  }

  if (!base[arcVersion]) {
    const msg = `Couldn't find existing base migration ('migration.json' > 'base').`;
    spinner.fail(msg);
    throw new Error(msg);
  }

  spinner.start("Migrating DAO...");
  let contributionRewardParams,
    genericSchemeParams,
    schemeRegistrarParams,
    globalConstraintRegistrarParams,
    upgradeSchemeParams;
  let tx;

  const {
    UController,
    DaoCreator,
    DAORegistry,
    DAOTracker,
    SchemeRegistrar,
    ContributionReward,
    UGenericScheme,
    GenericScheme,
    GenesisProtocol,
    GlobalConstraintRegistrar,
    UpgradeScheme
  } = base[arcVersion];

  const daoCreator = new web3.eth.Contract(
    utils.importAbi(`./${contractsDir}/${arcVersion}/DaoCreator.json`).abi,
    DaoCreator,
    opts
  );

  const uController =
    getArcVersionNumber(arcVersion) < 34
      ? new web3.eth.Contract(
          utils.importAbi(
            `./${contractsDir}/${arcVersion}/UController.json`
          ).abi,
          UController,
          opts
        )
      : null;

  const schemeRegistrar = new web3.eth.Contract(
    utils.importAbi(`./${contractsDir}/${arcVersion}/SchemeRegistrar.json`).abi,
    SchemeRegistrar,
    opts
  );

  const contributionReward = new web3.eth.Contract(
    utils.importAbi(
      `./${contractsDir}/${arcVersion}/ContributionReward.json`
    ).abi,
    ContributionReward,
    opts
  );

  const genericScheme = new web3.eth.Contract(
    getArcVersionNumber(arcVersion) >= 24 &&
    getArcVersionNumber(arcVersion) < 34
      ? utils.importAbi(`./${contractsDir}/${arcVersion}/UGenericScheme.json`)
          .abi
      : utils.importAbi(`./${contractsDir}/${arcVersion}/GenericScheme.json`)
          .abi,
    getArcVersionNumber(arcVersion) >= 24 &&
    getArcVersionNumber(arcVersion) < 34
      ? UGenericScheme
      : GenericScheme,
    opts
  );

  const globalConstraintRegistrar = new web3.eth.Contract(
    utils.importAbi(
      `./${contractsDir}/${arcVersion}/GlobalConstraintRegistrar.json`
    ).abi,
    GlobalConstraintRegistrar,
    opts
  );

  const upgradeScheme = new web3.eth.Contract(
    utils.importAbi(`./${contractsDir}/${arcVersion}/UpgradeScheme.json`).abi,
    UpgradeScheme,
    opts
  );

  const genesisProtocol = new web3.eth.Contract(
    utils.importAbi(`./${contractsDir}/${arcVersion}/GenesisProtocol.json`).abi,
    GenesisProtocol,
    opts
  );

  const randomName = utils.generateRnadomName();

  const [orgName, tokenName, tokenSymbol, founders] = [
    migrationParams.orgName !== undefined
      ? migrationParams.orgName
      : randomName,
    migrationParams.tokenName !== undefined
      ? migrationParams.tokenName
      : randomName + " Token",
    migrationParams.tokenSymbol !== undefined
      ? migrationParams.tokenSymbol
      : randomName[0] + randomName.split(" ")[1][0] + "T",
    migrationParams.founders
  ];

  let avatar;
  let daoToken;
  let reputation;
  let controller;

  if (deploymentState.Schemes === undefined) {
    deploymentState.Schemes = [];
    deploymentState.StandAloneContracts = [];
  }

  if (migrationParams.useDaoCreator === true) {
    const [founderAddresses, tokenDist, repDist] = [
      founders.map(({ address }) => address),
      founders.map(({ tokens }) =>
        web3.utils.toWei(tokens !== undefined ? tokens.toString() : "0")
      ),
      founders.map(({ reputation }) =>
        web3.utils.toWei(reputation !== undefined ? reputation.toString() : "0")
      )
    ];

    const initFoundersBatchSize = 20;
    const foundersBatchSize = 100;
    if (deploymentState.Avatar === undefined) {
      let foundersInitCount =
        founderAddresses.length < initFoundersBatchSize
          ? founderAddresses.length
          : initFoundersBatchSize;
      const forgeOrg =
        getArcVersionNumber(arcVersion) < 34
          ? daoCreator.methods.forgeOrg(
              orgName,
              tokenName,
              tokenSymbol,
              founderAddresses.slice(0, foundersInitCount),
              tokenDist.slice(0, foundersInitCount),
              repDist.slice(0, foundersInitCount),
              migrationParams.useUController === true
                ? UController
                : "0x0000000000000000000000000000000000000000",
              "0"
            )
          : daoCreator.methods.forgeOrg(
              orgName,
              tokenName,
              tokenSymbol,
              founderAddresses.slice(0, foundersInitCount),
              tokenDist.slice(0, foundersInitCount),
              repDist.slice(0, foundersInitCount),
              "0"
            );

      tx = (await sendTx(forgeOrg, "Creating a new organization...")).receipt;
      await logTx(tx, "Created new organization.");
    }

    if (deploymentState.Avatar === undefined) {
      deploymentState.Avatar = tx.events.NewOrg.returnValues._avatar;
      setState(deploymentState, network);
    }

    deploymentState.foundersToAddCount =
      deploymentState.foundersToAddCount === undefined
        ? founderAddresses.length - initFoundersBatchSize
        : deploymentState.foundersToAddCount;
    deploymentState.foundersAdditionCounter =
      deploymentState.foundersAdditionCounter === undefined
        ? 0
        : deploymentState.foundersAdditionCounter;
    while (deploymentState.foundersToAddCount > 0) {
      let currentBatchCount =
        deploymentState.foundersToAddCount < foundersBatchSize
          ? deploymentState.foundersToAddCount
          : foundersBatchSize;
      tx = (
        await sendTx(
          daoCreator.methods.addFounders(
            deploymentState.Avatar,
            founderAddresses.slice(
              deploymentState.foundersAdditionCounter * foundersBatchSize +
                initFoundersBatchSize,
              deploymentState.foundersAdditionCounter * foundersBatchSize +
                currentBatchCount +
                initFoundersBatchSize
            ),
            tokenDist.slice(
              deploymentState.foundersAdditionCounter * foundersBatchSize +
                initFoundersBatchSize,
              deploymentState.foundersAdditionCounter * foundersBatchSize +
                currentBatchCount +
                initFoundersBatchSize
            ),
            repDist.slice(
              deploymentState.foundersAdditionCounter * foundersBatchSize +
                initFoundersBatchSize,
              deploymentState.foundersAdditionCounter * foundersBatchSize +
                currentBatchCount +
                initFoundersBatchSize
            )
          ),
          "Adding founders..."
        )
      ).receipt;
      await logTx(tx, "Finished adding founders.");

      deploymentState.foundersToAddCount -= foundersBatchSize;
      deploymentState.foundersAdditionCounter++;
      setState(deploymentState, network);
    }

    avatar = new web3.eth.Contract(
      utils.importAbi(`./${contractsDir}/${arcVersion}/Avatar.json`).abi,
      deploymentState.Avatar,
      opts
    );

    daoToken = new web3.eth.Contract(
      utils.importAbi(`./${contractsDir}/${arcVersion}/DAOToken.json`).abi,
      await avatar.methods.nativeToken().call(),
      opts
    );

    reputation = new web3.eth.Contract(
      utils.importAbi(`./${contractsDir}/${arcVersion}/Reputation.json`).abi,
      await avatar.methods.nativeReputation().call(),
      opts
    );
    if (
      migrationParams.useUController &&
      getArcVersionNumber(arcVersion) < 34
    ) {
      deploymentState.Controller = UController;
      controller = uController;
    } else {
      spinner.start("Deploying Controller");
      controller = new web3.eth.Contract(
        utils.importAbi(`./${contractsDir}/${arcVersion}/Controller.json`).abi,
        await avatar.methods.owner().call(),
        opts
      );
      deploymentState.Controller = controller.options.address;
    }
  } else {
    if (deploymentState.DAOToken === undefined) {
      let { receipt, result } = await sendTx(
        new web3.eth.Contract(
          utils.importAbi(`./${contractsDir}/${arcVersion}/DAOToken.json`).abi,
          undefined,
          opts
        ).deploy({
          data: utils.importAbi(`./${contractsDir}/${arcVersion}/DAOToken.json`)
            .bytecode,
          arguments: [tokenName, tokenSymbol, 0]
        }),
        "Deploying DAO Token"
      );
      daoToken = result;
      await logTx(receipt, `${daoToken.options.address} => DAOToken`);

      deploymentState.DAOToken = daoToken.options.address;
      setState(deploymentState, network);
    }
    daoToken = new web3.eth.Contract(
      utils.importAbi(`./${contractsDir}/${arcVersion}/DAOToken.json`).abi,
      deploymentState.DAOToken,
      opts
    );

    if (deploymentState.Reputation === undefined) {
      let { receipt, result } = await sendTx(
        new web3.eth.Contract(
          utils.importAbi(
            `./${contractsDir}/${arcVersion}/Reputation.json`
          ).abi,
          undefined,
          opts
        ).deploy({
          data: utils.importAbi(
            `./${contractsDir}/${arcVersion}/Reputation.json`
          ).bytecode
        }),
        "Deploying Reputation"
      );
      reputation = result;
      await logTx(receipt, `${reputation.options.address} => Reputation`);

      deploymentState.Reputation = reputation.options.address;
      setState(deploymentState, network);
    }
    reputation = new web3.eth.Contract(
      utils.importAbi(`./${contractsDir}/${arcVersion}/Reputation.json`).abi,
      deploymentState.Reputation,
      opts
    );

    if (deploymentState.Avatar === undefined) {
      let { receipt, result } = await sendTx(
        new web3.eth.Contract(
          utils.importAbi(`./${contractsDir}/${arcVersion}/Avatar.json`).abi,
          undefined,
          opts
        ).deploy({
          data: utils.importAbi(`./${contractsDir}/${arcVersion}/Avatar.json`)
            .bytecode,
          arguments: [
            orgName,
            daoToken.options.address,
            reputation.options.address
          ]
        }),
        "Deploying Avatar."
      );
      avatar = result;
      await logTx(receipt, `${avatar.options.address} => Avatar`);

      deploymentState.Avatar = avatar.options.address;
      setState(deploymentState, network);
    }
    avatar = new web3.eth.Contract(
      utils.importAbi(`./${contractsDir}/${arcVersion}/Avatar.json`).abi,
      deploymentState.Avatar,
      opts
    );

    if (deploymentState.foundersReputationMintedCounter === undefined) {
      deploymentState.foundersReputationMintedCounter = 0;
    }
    for (
      deploymentState.foundersReputationMintedCounter;
      deploymentState.foundersReputationMintedCounter < founders.length;
      deploymentState.foundersReputationMintedCounter++
    ) {
      setState(deploymentState, network);

      let founder = founders[deploymentState.foundersReputationMintedCounter];

      if (founder.reputation > 0) {
        tx = (
          await sendTx(
            reputation.methods.mint(
              founder.address,
              web3.utils.toWei(`${founder.reputation}`)
            )
          )
        ).receipt;
        await logTx(
          tx,
          `Minted ${founder.reputation} reputation to ${founder.address}`,
          "Minting founders reputation"
        );
      }
    }
    deploymentState.foundersReputationMintedCounter++;
    setState(deploymentState, network);

    if (deploymentState.foundersTokenMintedCounter === undefined) {
      deploymentState.foundersTokenMintedCounter = 0;
    }
    for (
      deploymentState.foundersTokenMintedCounter;
      deploymentState.foundersTokenMintedCounter < founders.length;
      deploymentState.foundersTokenMintedCounter++
    ) {
      setState(deploymentState, network);

      let founder = founders[deploymentState.foundersTokenMintedCounter];

      if (founder.tokens > 0) {
        tx = (
          await sendTx(
            daoToken.methods.mint(
              founder.address,
              web3.utils.toWei(`${founder.tokens}`)
            ),
            "Minting founders tokens"
          )
        ).receipt;
        await logTx(
          tx,
          `Minted ${founder.tokens} tokens to ${founder.address}`
        );
      }
    }
    deploymentState.foundersTokenMintedCounter++;
    setState(deploymentState, network);

    if (
      migrationParams.useUController &&
      getArcVersionNumber(arcVersion) < 34
    ) {
      deploymentState.Controller = UController;
      controller = uController;
    } else {
      if (deploymentState.Controller === undefined) {
        let { receipt, result } = await sendTx(
          new web3.eth.Contract(
            utils.importAbi(
              `./${contractsDir}/${arcVersion}/Controller.json`
            ).abi,
            undefined,
            opts
          ).deploy({
            data: utils.importAbi(
              `./${contractsDir}/${arcVersion}/Controller.json`
            ).bytecode,
            arguments: [avatar.options.address]
          }),
          "Deploying Controller"
        );
        controller = result;
        await logTx(receipt, `${controller.options.address} => Controller`);

        deploymentState.Controller = controller.options.address;
        setState(deploymentState, network);
      }
      controller = new web3.eth.Contract(
        utils.importAbi(`./${contractsDir}/${arcVersion}/Controller.json`).abi,
        deploymentState.Controller,
        opts
      );
    }

    if (
      migrationParams.noTrack !== true &&
      getArcVersionNumber(arcVersion) >= 29 &&
      deploymentState.trackedDAO !== true
    ) {
      const daoTracker = new web3.eth.Contract(
        utils.importAbi(`./${contractsDir}/${arcVersion}/DAOTracker.json`).abi,
        DAOTracker,
        opts
      );
      tx = (
        await sendTx(
          getArcVersionNumber(arcVersion) >= 32
            ? await daoTracker.methods.track(
                avatar.options.address,
                deploymentState.Controller,
                arcVersion
              )
            : await daoTracker.methods.track(
                avatar.options.address,
                deploymentState.Controller
              ),
          "Registering DAO in DAOTracker"
        )
      ).receipt;
      await logTx(tx, "Finished Registering DAO in DAOTracker");
      deploymentState.trackedDAO = true;
      setState(deploymentState, network);
    }

    if (deploymentState.transferredAvatarOwnership !== true) {
      tx = (
        await sendTx(
          avatar.methods.transferOwnership(deploymentState.Controller),
          "Transfer Avatar to Controller ownership"
        )
      ).receipt;
      await logTx(tx, "Finished transferring Avatar to Controller ownership");
      deploymentState.transferredAvatarOwnership = true;
      setState(deploymentState, network);
    }

    if (deploymentState.transferredReputationOwnership !== true) {
      tx = (
        await sendTx(
          reputation.methods.transferOwnership(deploymentState.Controller),
          "Transfer Reputation to Controller ownership"
        )
      ).receipt;
      await logTx(
        tx,
        "Finished transferring Reputation to Controller ownership"
      );
      deploymentState.transferredReputationOwnership = true;
      setState(deploymentState, network);
    }

    if (deploymentState.transferredDAOTokenOwnership !== true) {
      tx = (
        await sendTx(
          daoToken.methods.transferOwnership(deploymentState.Controller),
          "Transfer DAOToken to Controller ownership"
        )
      ).receipt;
      await logTx(tx, "Finished transferring DAOToken to Controller ownership");
      deploymentState.transferredDAOTokenOwnership = true;
      setState(deploymentState, network);
    }

    if (
      migrationParams.useUController &&
      getArcVersionNumber(arcVersion) < 34 &&
      deploymentState.registeredAvatarToUController !== true
    ) {
      tx = (
        await sendTx(
          controller.methods.newOrganization(avatar.options.address),
          "Register Avatar to UController"
        )
      ).receipt;
      await logTx(tx, "Finished registerring Avatar");
      deploymentState.registeredAvatarToUController = true;
      setState(deploymentState, network);
    }
  }

  if (network === "private") {
    const daoRegistry = new web3.eth.Contract(
      utils.importAbi(`./${contractsDir}/${arcVersion}/DAORegistry.json`).abi,
      DAORegistry,
      opts
    );

    if (deploymentState.proposedRegisteringDAO !== true) {
      tx = (
        await sendTx(
          daoRegistry.methods.propose(avatar.options.address),
          "Proposing DAO in DAORegistry"
        )
      ).receipt;
      deploymentState.proposedRegisteringDAO = true;
      setState(deploymentState, network);
      await logTx(tx, "Finished Proposing DAO in DAORegistry");
    }
    if (deploymentState.registeredRegisteringDAO !== true) {
      let DAOname = await avatar.methods.orgName().call();
      tx = (
        await sendTx(
          daoRegistry.methods.register(avatar.options.address, DAOname),
          "Registering DAO in DAORegistry"
        )
      ).receipt;
      deploymentState.registeredRegisteringDAO = true;
      setState(deploymentState, network);
      await logTx(tx, "Finished Registering DAO in DAORegistry");
    }
  }

  if (deploymentState.schemeNames === undefined) {
    deploymentState.schemeNames = [];
    deploymentState.schemes = [];
    deploymentState.params = [];
    deploymentState.permissions = [];
    deploymentState.votingMachinesParams = [];
  }
  if (
    migrationParams.VotingMachinesParams !== undefined &&
    migrationParams.VotingMachinesParams.length > 0
  ) {
    if (deploymentState.registeredGenesisProtocolParamsCount === undefined) {
      deploymentState.registeredGenesisProtocolParamsCount = 0;
    }
    for (
      deploymentState.registeredGenesisProtocolParamsCount;
      deploymentState.registeredGenesisProtocolParamsCount <
      migrationParams.VotingMachinesParams.length;
      deploymentState.registeredGenesisProtocolParamsCount++
    ) {
      setState(deploymentState, network);
      if (
        migrationParams.VotingMachinesParams[
          deploymentState.registeredGenesisProtocolParamsCount
        ].votingParamsHash !== undefined
      ) {
        deploymentState.votingMachinesParams.push(
          migrationParams.VotingMachinesParams[
            deploymentState.registeredGenesisProtocolParamsCount
          ].votingParamsHash
        );
        setState(deploymentState, network);
        continue;
      }
      let parameters = [
        [
          migrationParams.VotingMachinesParams[
            deploymentState.registeredGenesisProtocolParamsCount
          ].queuedVoteRequiredPercentage.toString(),
          migrationParams.VotingMachinesParams[
            deploymentState.registeredGenesisProtocolParamsCount
          ].queuedVotePeriodLimit.toString(),
          migrationParams.VotingMachinesParams[
            deploymentState.registeredGenesisProtocolParamsCount
          ].boostedVotePeriodLimit.toString(),
          migrationParams.VotingMachinesParams[
            deploymentState.registeredGenesisProtocolParamsCount
          ].preBoostedVotePeriodLimit.toString(),
          migrationParams.VotingMachinesParams[
            deploymentState.registeredGenesisProtocolParamsCount
          ].thresholdConst.toString(),
          migrationParams.VotingMachinesParams[
            deploymentState.registeredGenesisProtocolParamsCount
          ].quietEndingPeriod.toString(),
          web3.utils.toWei(
            migrationParams.VotingMachinesParams[
              deploymentState.registeredGenesisProtocolParamsCount
            ].proposingRepReward.toString()
          ),
          migrationParams.VotingMachinesParams[
            deploymentState.registeredGenesisProtocolParamsCount
          ].votersReputationLossRatio.toString(),
          web3.utils.toWei(
            migrationParams.VotingMachinesParams[
              deploymentState.registeredGenesisProtocolParamsCount
            ].minimumDaoBounty.toString()
          ),
          migrationParams.VotingMachinesParams[
            deploymentState.registeredGenesisProtocolParamsCount
          ].daoBountyConst.toString(),
          migrationParams.VotingMachinesParams[
            deploymentState.registeredGenesisProtocolParamsCount
          ].activationTime.toString()
        ],
        migrationParams.VotingMachinesParams[
          deploymentState.registeredGenesisProtocolParamsCount
        ].voteOnBehalf
      ];
      const genesisProtocolSetParams = genesisProtocol.methods.setParameters(
        ...parameters
      );

      let votingMachinesParams = await genesisProtocolSetParams.call();
      const votingMachineCheckParams = await genesisProtocol.methods
        .parameters(votingMachinesParams)
        .call();
      if (votingMachineCheckParams.minimumDaoBounty === "0") {
        tx = (
          await sendTx(
            genesisProtocolSetParams,
            "Setting GenesisProtocol parameters..."
          )
        ).receipt;
        await logTx(
          tx,
          "GenesisProtocol parameters set. | Params Hash: " +
            votingMachinesParams +
            "\nParameters:\n" +
            parameters.toString().replace(/,/g, ",\n")
        );
      }

      deploymentState.votingMachinesParams.push(votingMachinesParams);
      setState(deploymentState, network);
    }
  }
  deploymentState.registeredGenesisProtocolParamsCount++;
  setState(deploymentState, network);

  if (migrationParams.schemes.SchemeRegistrar) {
    if (deploymentState.SchemeRegistrarParamsCount === undefined) {
      deploymentState.SchemeRegistrarParamsCount = 0;
    }
    for (
      deploymentState.SchemeRegistrarParamsCount;
      deploymentState.SchemeRegistrarParamsCount <
      migrationParams.SchemeRegistrar.length;
      deploymentState.SchemeRegistrarParamsCount++
    ) {
      setState(deploymentState, network);

      let parameters = [
        migrationParams.SchemeRegistrar[
          deploymentState.SchemeRegistrarParamsCount
        ].voteRegisterParams === undefined
          ? deploymentState.votingMachinesParams[0]
          : deploymentState.votingMachinesParams[
              migrationParams.SchemeRegistrar[
                deploymentState.SchemeRegistrarParamsCount
              ].voteRegisterParams
            ],
        migrationParams.SchemeRegistrar[
          deploymentState.SchemeRegistrarParamsCount
        ].voteRemoveParams === undefined
          ? deploymentState.votingMachinesParams[0]
          : deploymentState.votingMachinesParams[
              migrationParams.SchemeRegistrar[
                deploymentState.SchemeRegistrarParamsCount
              ].voteRemoveParams
            ],
        migrationParams.SchemeRegistrar[
          deploymentState.SchemeRegistrarParamsCount
        ].votingMachine === undefined
          ? GenesisProtocol
          : migrationParams.SchemeRegistrar[
              deploymentState.SchemeRegistrarParamsCount
            ].votingMachine
      ];
      const schemeRegistrarSetParams = schemeRegistrar.methods.setParameters(
        ...parameters
      );
      schemeRegistrarParams = await schemeRegistrarSetParams.call();

      const schemeRegistrarCheckParams = await schemeRegistrar.methods
        .parameters(schemeRegistrarParams)
        .call();
      if (
        schemeRegistrarCheckParams.intVote ===
        "0x0000000000000000000000000000000000000000"
      ) {
        tx = (
          await sendTx(
            schemeRegistrarSetParams,
            "Setting Scheme Registrar parameters..."
          )
        ).receipt;
        await logTx(
          tx,
          "Scheme Registrar parameters set. | Params Hash: " +
            schemeRegistrarParams +
            "\nParameters:\n" +
            parameters.toString().replace(/,/g, ",\n")
        );
      }

      deploymentState.schemeNames.push("Scheme Registrar");
      deploymentState.schemes.push(SchemeRegistrar);
      deploymentState.params.push(schemeRegistrarParams);
      deploymentState.permissions.push("0x0000001F");
      setState(deploymentState, network);
    }
    deploymentState.SchemeRegistrarParamsCount++;
    setState(deploymentState, network);
  }

  if (migrationParams.schemes.ContributionReward) {
    if (deploymentState.ContributionRewardParamsCount === undefined) {
      deploymentState.ContributionRewardParamsCount = 0;
    }
    for (
      deploymentState.ContributionRewardParamsCount;
      deploymentState.ContributionRewardParamsCount <
      migrationParams.ContributionReward.length;
      deploymentState.ContributionRewardParamsCount++
    ) {
      setState(deploymentState, network);
      let parameters = [
        migrationParams.ContributionReward[
          deploymentState.ContributionRewardParamsCount
        ].voteParams === undefined
          ? deploymentState.votingMachinesParams[0]
          : deploymentState.votingMachinesParams[
              migrationParams.ContributionReward[
                deploymentState.ContributionRewardParamsCount
              ].voteParams
            ],
        migrationParams.ContributionReward[
          deploymentState.ContributionRewardParamsCount
        ].votingMachine === undefined
          ? GenesisProtocol
          : migrationParams.ContributionReward[
              deploymentState.ContributionRewardParamsCount
            ].votingMachine
      ];
      const contributionRewardSetParams = contributionReward.methods.setParameters(
        ...parameters
      );
      contributionRewardParams = await contributionRewardSetParams.call();

      const contributionRewardCheckParams = await contributionReward.methods
        .parameters(contributionRewardParams)
        .call();
      if (
        contributionRewardCheckParams.intVote ===
        "0x0000000000000000000000000000000000000000"
      ) {
        tx = (
          await sendTx(
            contributionRewardSetParams,
            "Setting Contribution Reward parameters..."
          )
        ).receipt;
        await logTx(
          tx,
          "Contribution Reward parameters set. | Params Hash: " +
            contributionRewardParams +
            "\nParameters:" +
            parameters.toString().replace(/,/g, ",\n")
        );
      }

      deploymentState.schemeNames.push("Contribution Reward");
      deploymentState.schemes.push(ContributionReward);
      deploymentState.params.push(contributionRewardParams);
      deploymentState.permissions.push("0x00000000");
      setState(deploymentState, network);
    }
    deploymentState.ContributionRewardParamsCount++;
    setState(deploymentState, network);
  }

  if (
    migrationParams.schemes.UGenericScheme &&
    getArcVersionNumber(arcVersion) < 34
  ) {
    if (deploymentState.UGenericSchemeParamsCount === undefined) {
      deploymentState.UGenericSchemeParamsCount = 0;
    }
    for (
      deploymentState.UGenericSchemeParamsCount;
      deploymentState.UGenericSchemeParamsCount <
      migrationParams.UGenericScheme.length;
      deploymentState.UGenericSchemeParamsCount++
    ) {
      setState(deploymentState, network);
      let parameters = [
        migrationParams.UGenericScheme[
          deploymentState.UGenericSchemeParamsCount
        ].voteParams === undefined
          ? deploymentState.votingMachinesParams[0]
          : deploymentState.votingMachinesParams[
              migrationParams.UGenericScheme[
                deploymentState.UGenericSchemeParamsCount
              ].voteParams
            ],
        migrationParams.UGenericScheme[
          deploymentState.UGenericSchemeParamsCount
        ].votingMachine === undefined
          ? GenesisProtocol
          : migrationParams.UGenericScheme[
              deploymentState.UGenericSchemeParamsCount
            ].votingMachine,
        migrationParams.UGenericScheme[
          deploymentState.UGenericSchemeParamsCount
        ].targetContract
      ];
      const genericSchemeSetParams = genericScheme.methods.setParameters(
        ...parameters
      );
      genericSchemeParams = await genericSchemeSetParams.call();

      const genericSchemeCheckParams = await genericScheme.methods
        .parameters(genericSchemeParams)
        .call();
      if (
        genericSchemeCheckParams.intVote ===
        "0x0000000000000000000000000000000000000000"
      ) {
        tx = (
          await sendTx(
            genericSchemeSetParams,
            "Setting Generic Scheme parameters..."
          )
        ).receipt;
        await logTx(
          tx,
          "Generic Scheme parameters set. | Params Hash: " +
            genericSchemeParams +
            "\nParameters:\n" +
            parameters.toString().replace(/,/g, ",\n")
        );
      }

      deploymentState.schemeNames.push("Generic Scheme");
      deploymentState.schemes.push(
        getArcVersionNumber(arcVersion) >= 24 ? UGenericScheme : GenericScheme
      );
      deploymentState.params.push(genericSchemeParams);
      deploymentState.permissions.push("0x00000010");
      setState(deploymentState, network);
    }
    deploymentState.UGenericSchemeParamsCount++;
    setState(deploymentState, network);
  }

  if (migrationParams.schemes.GlobalConstraintRegistrar) {
    if (deploymentState.GlobalConstraintRegistrarParamsCount === undefined) {
      deploymentState.GlobalConstraintRegistrarParamsCount = 0;
    }
    for (
      deploymentState.GlobalConstraintRegistrarParamsCount;
      deploymentState.GlobalConstraintRegistrarParamsCount <
      migrationParams.GlobalConstraintRegistrar.length;
      deploymentState.GlobalConstraintRegistrarParamsCount++
    ) {
      setState(deploymentState, network);
      let parameters = [
        migrationParams.GlobalConstraintRegistrar[
          deploymentState.GlobalConstraintRegistrarParamsCount
        ].voteParams === undefined
          ? deploymentState.votingMachinesParams[0]
          : deploymentState.votingMachinesParams[
              migrationParams.GlobalConstraintRegistrar[
                deploymentState.GlobalConstraintRegistrarParamsCount
              ].voteParams
            ],
        migrationParams.GlobalConstraintRegistrar[
          deploymentState.GlobalConstraintRegistrarParamsCount
        ].votingMachine === undefined
          ? GenesisProtocol
          : migrationParams.GlobalConstraintRegistrar[
              deploymentState.GlobalConstraintRegistrarParamsCount
            ].votingMachine
      ];
      const globalConstraintRegistrarSetParams = globalConstraintRegistrar.methods.setParameters(
        ...parameters
      );
      globalConstraintRegistrarParams = await globalConstraintRegistrarSetParams.call();

      const globalConstraintRegistrarCheckParams = await globalConstraintRegistrar.methods
        .parameters(globalConstraintRegistrarParams)
        .call();
      if (
        globalConstraintRegistrarCheckParams.intVote ===
        "0x0000000000000000000000000000000000000000"
      ) {
        tx = (
          await sendTx(
            globalConstraintRegistrarSetParams,
            "Setting Global Constraint Registrar parameters..."
          )
        ).receipt;
        await logTx(
          tx,
          "Global Constraints Registrar parameters set. | Params Hash: " +
            globalConstraintRegistrarParams +
            "\nParameters:\n" +
            parameters.toString().replace(/,/g, ",\n")
        );
      }

      deploymentState.schemeNames.push("Global Constraints Registrar");
      deploymentState.schemes.push(GlobalConstraintRegistrar);
      deploymentState.params.push(globalConstraintRegistrarParams);
      deploymentState.permissions.push("0x00000004");
      setState(deploymentState, network);
    }
    deploymentState.GlobalConstraintRegistrarParamsCount++;
    setState(deploymentState, network);
  }

  if (migrationParams.schemes.UpgradeScheme) {
    if (deploymentState.UpgradeSchemeParamsCount === undefined) {
      deploymentState.UpgradeSchemeParamsCount = 0;
    }
    for (
      deploymentState.UpgradeSchemeParamsCount;
      deploymentState.UpgradeSchemeParamsCount <
      migrationParams.UpgradeScheme.length;
      deploymentState.UpgradeSchemeParamsCount++
    ) {
      setState(deploymentState, network);
      let parameters = [
        migrationParams.UpgradeScheme[deploymentState.UpgradeSchemeParamsCount]
          .voteParams === undefined
          ? deploymentState.votingMachinesParams[0]
          : deploymentState.votingMachinesParams[
              migrationParams.UpgradeScheme[
                deploymentState.UpgradeSchemeParamsCount
              ].voteParams
            ],
        migrationParams.UpgradeScheme[deploymentState.UpgradeSchemeParamsCount]
          .votingMachine === undefined
          ? GenesisProtocol
          : migrationParams.UpgradeScheme[
              deploymentState.UpgradeSchemeParamsCount
            ].votingMachine
      ];
      const upgradeSchemeSetParams = upgradeScheme.methods.setParameters(
        ...parameters
      );
      upgradeSchemeParams = await upgradeSchemeSetParams.call();

      const upgradeSchemeCheckParams = await upgradeScheme.methods
        .parameters(upgradeSchemeParams)
        .call();
      if (
        upgradeSchemeCheckParams.intVote ===
        "0x0000000000000000000000000000000000000000"
      ) {
        tx = (
          await sendTx(
            upgradeSchemeSetParams,
            "Setting Upgrade Scheme parameters..."
          )
        ).receipt;
        await logTx(
          tx,
          "Upgrade Scheme parameters set. | Params Hash: " +
            upgradeSchemeParams +
            "\nParameters:\n" +
            parameters.toString().replace(/,/g, ",\n")
        );
      }

      deploymentState.schemeNames.push("Upgrade Scheme");
      deploymentState.schemes.push(UpgradeScheme);
      deploymentState.params.push(upgradeSchemeParams);
      deploymentState.permissions.push("0x0000000A");
      setState(deploymentState, network);
    }
    deploymentState.UpgradeSchemeParamsCount++;
    setState(deploymentState, network);
  }

  if (migrationParams.StandAloneContracts) {
    let len = migrationParams.StandAloneContracts.length;
    if (deploymentState.standAloneContractsCounter === undefined) {
      deploymentState.standAloneContractsCounter = 0;
    }
    for (
      deploymentState.standAloneContractsCounter;
      deploymentState.standAloneContractsCounter < len;
      deploymentState.standAloneContractsCounter++
    ) {
      setState(deploymentState, network);
      let standAlone =
        migrationParams.StandAloneContracts[
          deploymentState.standAloneContractsCounter
        ];

      const path = require("path");
      let contractJson;
      if (standAlone.fromArc) {
        contractJson = utils.importAbi(
          `./${contractsDir}/${
            standAlone.arcVersion ? standAlone.arcVersion : arcVersion
          }/${standAlone.name}.json`
        );
      } else {
        contractJson = require(path.resolve(
          `${customAbisLocation}/${standAlone.name}.json`
        ));
      }
      let abi = contractJson.abi;
      let bytecode = contractJson.bytecode;

      const StandAloneContract = new web3.eth.Contract(abi, undefined, opts);
      const { receipt, result: standAloneContract } = await sendTx(
        StandAloneContract.deploy({
          data: bytecode,
          arguments: null
        }),
        `Migrating ${standAlone.name}...`
      );
      await logTx(
        receipt,
        `${standAloneContract.options.address} => ${standAlone.name}`
      );

      if (standAlone.params !== undefined) {
        let contractParams = [];
        for (let i in standAlone.params) {
          if (standAlone.params[i].StandAloneContract !== undefined) {
            contractParams.push(
              deploymentState.StandAloneContracts[
                standAlone.params[i].StandAloneContract
              ].address
            );
          } else {
            contractParams.push(standAlone.params[i]);
          }
        }
        const contractSetParams = standAloneContract.methods.initialize(
          ...contractParams
        );

        tx = (
          await sendTx(contractSetParams, `Initializing ${standAlone.name}...`)
        ).receipt;
        await logTx(tx, `${standAlone.name} initialized.`);
      }

      if (standAlone.runFunctions !== undefined) {
        for (let i in standAlone.runFunctions) {
          let functionParams = [];
          for (let j in standAlone.runFunctions[i].params) {
            if (
              standAlone.runFunctions[i].params[j].StandAloneContract !==
              undefined
            ) {
              functionParams.push(
                deploymentState.StandAloneContracts[
                  standAlone.runFunctions[i].params[j].StandAloneContract
                ].address
              );
            } else if (
              standAlone.runFunctions[i].params[j] === "AvatarAddress"
            ) {
              functionParams.push(avatar.options.address);
            } else {
              functionParams.push(standAlone.runFunctions[i].params[j]);
            }
          }
          const functionCall = standAloneContract.methods[
            standAlone.runFunctions[i].functionName
          ](...functionParams);

          tx = (
            await sendTx(
              functionCall,
              `Calling ${standAlone.name} - ${standAlone.runFunctions[i].functionName}...`
            )
          ).receipt;
          await logTx(
            tx,
            `${standAlone.name} called function ${standAlone.runFunctions[i].functionName}.`
          );
        }
      }

      deploymentState.StandAloneContracts.push({
        name: standAlone.name,
        alias: standAlone.alias,
        address: standAloneContract.options.address,
        arcVersion: standAlone.arcVersion ? standAlone.arcVersion : arcVersion
      });
      setState(deploymentState, network);
    }
    deploymentState.standAloneContractsCounter++;
    setState(deploymentState, network);
  }

  if (migrationParams.CustomSchemes) {
    let len = migrationParams.CustomSchemes.length;
    if (deploymentState.CustomSchemeCounter === undefined) {
      deploymentState.CustomSchemeCounter = 0;
    }
    for (
      deploymentState.CustomSchemeCounter;
      deploymentState.CustomSchemeCounter < len;
      deploymentState.CustomSchemeCounter++
    ) {
      setState(deploymentState, network);
      let customeScheme =
        migrationParams.CustomSchemes[deploymentState.CustomSchemeCounter];
      const path = require("path");
      let contractJson;
      if (customeScheme.fromArc) {
        contractJson = utils.importAbi(
          `./${contractsDir}/${
            customeScheme.arcVersion ? customeScheme.arcVersion : arcVersion
          }/${customeScheme.name}.json`
        );
      } else {
        contractJson = require(path.resolve(
          `${customAbisLocation}/${customeScheme.name}.json`
        ));
      }
      let abi = contractJson.abi;
      let bytecode = contractJson.bytecode;
      let schemeContract;
      if (customeScheme.address === undefined) {
        const SchemeContract = new web3.eth.Contract(abi, undefined, opts);
        let { receipt, result } = await sendTx(
          SchemeContract.deploy({
            data: bytecode,
            arguments: null
          }),
          `Migrating ${customeScheme.name}...`
        );
        schemeContract = result;
        await logTx(
          receipt,
          `${schemeContract.options.address} => ${customeScheme.name}`
        );
      } else {
        if (customeScheme.address.StandAloneContract !== undefined) {
          customeScheme.address =
            deploymentState.StandAloneContracts[
              customeScheme.address.StandAloneContract
            ].address;
        }
        schemeContract = new web3.eth.Contract(
          abi,
          customeScheme.address,
          opts
        );
      }

      let schemeParamsHash =
        "0x0000000000000000000000000000000000000000000000000000000000000000";
      if (customeScheme.isUniversal) {
        let schemeParams = [];
        for (let i in customeScheme.params) {
          if (customeScheme.params[i].voteParams !== undefined) {
            schemeParams.push(
              deploymentState.votingMachinesParams[
                customeScheme.params[i].voteParams
              ]
            );
          } else if (customeScheme.params[i] === "GenesisProtocolAddress") {
            schemeParams.push(GenesisProtocol);
          } else {
            schemeParams.push(customeScheme.params[i]);
          }
        }
        const schemeSetParams = schemeContract.methods.setParameters(
          ...schemeParams
        );
        schemeParamsHash = await schemeSetParams.call();
        tx = (
          await sendTx(
            schemeSetParams,
            `Setting ${customeScheme.name} parameters...`
          )
        ).receipt;
        await logTx(
          tx,
          customeScheme.name +
            " parameters set. | Params Hash: " +
            schemeParamsHash +
            "\nParameters:\n" +
            schemeParams.toString().replace(/,/g, ",\n")
        );
      } else if (schemeContract.methods.initialize !== undefined) {
        let schemeParams = [avatar.options.address];
        for (let i in customeScheme.params) {
          if (customeScheme.params[i].voteParams !== undefined) {
            schemeParams.push(
              deploymentState.votingMachinesParams[
                customeScheme.params[i].voteParams
              ]
            );
          } else if (customeScheme.params[i] === "GenesisProtocolAddress") {
            schemeParams.push(GenesisProtocol);
          } else if (customeScheme.params[i].StandAloneContract !== undefined) {
            schemeParams.push(
              deploymentState.StandAloneContracts[
                customeScheme.params[i].StandAloneContract
              ].address
            );
          } else if (customeScheme.params[i] === "AvatarAddress") {
            schemeParams.push(avatar.options.address);
          } else {
            schemeParams.push(customeScheme.params[i]);
          }
        }
        const schemeSetParams = schemeContract.methods.initialize(
          ...schemeParams
        );
        schemeParamsHash = await schemeSetParams.call();
        if (schemeParamsHash.Result === undefined) {
          schemeParamsHash =
            "0x0000000000000000000000000000000000000000000000000000000000000000";
        }
        tx = (
          await sendTx(schemeSetParams, `Initializing ${customeScheme.name}...`)
        ).receipt;
        await logTx(tx, `${customeScheme.name} initialized.`);
      } else {
        continue;
      }

      deploymentState.schemeNames.push(customeScheme.name);
      deploymentState.schemes.push(schemeContract.options.address);
      deploymentState.params.push(schemeParamsHash);
      deploymentState.permissions.push(customeScheme.permissions);
      deploymentState.Schemes.push({
        name: customeScheme.name,
        alias: customeScheme.alias,
        address: schemeContract.options.address,
        arcVersion: customeScheme.arcVersion
          ? customeScheme.arcVersion
          : arcVersion
      });
      setState(deploymentState, network);
    }
    deploymentState.CustomSchemeCounter++;
    setState(deploymentState, network);
  }

  if (deploymentState.schemesSet !== true) {
    if (migrationParams.useDaoCreator === true) {
      tx = (
        await sendTx(
          daoCreator.methods.setSchemes(
            avatar.options.address,
            deploymentState.schemes,
            deploymentState.params,
            deploymentState.permissions,
            "metaData"
          ),
          "Setting DAO schemes..."
        )
      ).receipt;
      await logTx(tx, "DAO schemes set.");
      deploymentState.schemesSet = true;
      setState(deploymentState, network);
    } else {
      for (
        let i =
          deploymentState.schemesSetCounter === undefined
            ? 0
            : deploymentState.schemesSetCounter;
        i < deploymentState.schemes.length;
        i++
      ) {
        deploymentState.schemesSetCounter = i;
        setState(deploymentState, network);
        tx = (
          await sendTx(
            controller.methods.registerScheme(
              deploymentState.schemes[i],
              deploymentState.params[i],
              deploymentState.permissions[i],
              avatar.options.address
            ),
            "Registering " + deploymentState.schemeNames[i] + " to the DAO..."
          )
        ).receipt;
        await logTx(
          tx,
          deploymentState.schemeNames[i] +
            " was successfully registered to the DAO."
        );
      }
      deploymentState.schemesSet = true;
      setState(deploymentState, network);
    }
    deploymentState.schemesSetCounter++;
    setState(deploymentState, network);
  }

  let dao = {
    name: orgName,
    Avatar: avatar.options.address,
    DAOToken: daoToken.options.address,
    Reputation: reputation.options.address,
    Controller: deploymentState.Controller,
    Schemes: deploymentState.Schemes,
    StandAloneContracts: deploymentState.StandAloneContracts,
    arcVersion
  };
  console.log(JSON.stringify(dao, null, 2));
  let migration = { dao: previousMigration.dao || {} };
  migration.dao[arcVersion] = dao;

  cleanState(network);
  spinner.succeed("DAO Migration has Finished Successfully!");
  return migration;
}

module.exports = migrateDAO;
