type VotingMachinConfig = {
  name: string
  address?: string
  options?: { [optionKey: string]: string } // mapping from optionKey to type
}
