import React, { useCallback, useState } from "react";
import { DAOForm } from "@dorgtech/daocreator-lib";
import { useDropzone } from "react-dropzone";
import {
  MDBIcon,
  MDBModal,
  MDBModalHeader,
  MDBModalBody,
  MDBModalFooter,
  MDBCol,
  MDBContainer
} from "mdbreact";

function MyDropzone(props: any) {
  const onDrop = useCallback(acceptedFiles => {
    props.onFilePicked(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div style={styles.dropzoneContainer}>
        <MDBCol size="12" style={styles.dropzoneInput}>
          <p style={{ marginTop: "25px" }}>
            <MDBIcon far icon="file-alt" style={{ marginRight: "10px" }} />
            Drag & drop your JSON file here
          </p>
        </MDBCol>
      </div>
    </div>
  );
}
interface ImportError {
  file: string;
  message: string;
}

interface Props {
  title: string;
  form: DAOForm;
  reviewStep: any;
  setTitle: any;
}
export function ImportModal(props: Props) {
  const { title, form, reviewStep, setTitle } = props;
  const open = title ? true : false;
  const [error, setError] = useState<any>();
  const [fileAdded, setFileAdded] = useState<boolean>(false);

  const onFilePicked = async (acceptedFiles: File[]) => {
    if (acceptedFiles === null) {
      return;
    }

    const files = Array.from(acceptedFiles);

    if (files.length === 0) {
      return;
    }

    const file: File = files[0];

    try {
      await form.fromMigrationParamsFile(file);
      await form.validate();
    } catch (e) {
      onError(file.name, e.message);
      return;
    }

    setFileAdded(true);
  };

  const onImport = () => {
    if (!error && fileAdded) {
      reviewStep(3);
      onClose();
    }
  };

  const onError = (file: string, message: string) => {
    setError({
      file,
      message
    });
  };

  const ImportErrors = (props: { error: ImportError }) => (
    <>
      <strong>We encountered an issue during the import process:</strong>
      <br />
      <div>
        {props.error.file}: {props.error.message}
      </div>
    </>
  );

  const onClose = () => {
    setTitle("");
    setError(null);
    setFileAdded(false);
  };

  return (
    <MDBContainer>
      <MDBCol>
        <MDBModal
          isOpen={open}
          fullWidth={true}
          maxWidth="md"
          toggle={() => console.log("a")}
        >
          <MDBModalHeader style={styles.titlePadding}>
            {" "}
            <span style={styles.bold}>{title}</span>
          </MDBModalHeader>
          <MDBModalBody>
            {error ? (
              <ImportErrors error={error} />
            ) : (
              <MyDropzone onFilePicked={onFilePicked} />
            )}
          </MDBModalBody>
          <MDBModalFooter>
            <button style={styles.cancelButton} onClick={onClose}>
              Close
            </button>
            <button style={styles.importButton} onClick={onImport}>
              Import JSON File
            </button>
          </MDBModalFooter>
        </MDBModal>
      </MDBCol>
    </MDBContainer>
  );
}

const styles = {
  titlePadding: {
    padding: "26px"
  },
  bold: {
    fontWeight: 700,
    fontSize: "18px"
  },
  cancelButton: {
    backgroundColor: "white",
    color: "darkgrey",
    fontSize: "smaller",
    fontWeight: 700,
    borderRadius: "0.37rem",
    height: "45px",
    width: "110px",
    marginRight: "243px"
  },
  importButton: {
    backgroundColor: "#1976d2",
    color: "white",
    fontSize: "smaller",
    fontWeight: 300,
    borderRadius: "0.37rem",
    height: "45px",
    width: "145px"
  },
  dropzoneContainer: {
    height: "150px",
    top: "0",
    left: "0"
  },
  dropzoneInput: {
    width: "90%",
    height: "50%",
    top: "25%",
    margin: "0 auto",
    position: "relative",
    borderStyle: "dotted",
    borderWidth: "1px",
    textAlign: "center",
    fontWeight: 300,
    borderColor: "lightgray"
  }
};
