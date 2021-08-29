
import React,{Component} from 'react';
import minter from './minter';
import web3 from "./web3";
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';
import { File } from 'web3.storage/dist/bundle.esm.min.js';
function getAccessToken() {
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGVkNmZkZkJCZUMxNkU1ZjcwOEI4M2Y1QjNhMzM5MzBDRTkxMGFGMDEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Mjg0OTA2NzY0MzAsIm5hbWUiOiJFdGhpb3BpYXYxIn0.Ny7MnwcSNRv3GEZeQLZmrZNZ4_L3Cac-F_mi9XEh2fg';
}
function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() })
}
class Uploader extends Component {

    state = {

      // Initially, no file is selected
      selectedFile: null
    };

    // On file select (from the pop up)
    onFileChange = event => {

      // Update the state
      this.setState({ selectedFile: event.target.files[0] });

    };

    // On file upload (click the upload button)
    onFileUpload = async () => {

      // Create an object of formData
      const formData = new FormData();

      // Update the formData object
      formData.append(
        "myFile",
        this.state.selectedFile,
        this.state.selectedFile.name
      );

      // Details of the uploaded file
      console.log(this.state.selectedFile);

      const image = this.state.selectedFile;
      console.log(image);
      const buffer = Buffer.from(JSON.stringify(image));
      const file = [new File([buffer], "image.png")];
      console.log(file);
      const client = makeStorageClient();
      this.setState({message: "Storing image to IPFS/Filecoin"})
      const cid = await client.put(file);
      console.log('stored files with cid:', cid);
      this.setState({cid: cid});
      this.setState({message: "Success...  Minting your NFT..."})
      const accounts = await web3.eth.getAccounts();
      await minter.methods.mint(cid, accounts[0]).send({
        from: accounts[0],
      });
      this.setState({message: "Nice!  We did it!"});
    };


    // File content to be displayed after
    // file upload is complete
    fileData = () => {

      if (this.state.selectedFile) {

        return (
          <div>
            <h2>File Details:</h2>

<p>File Name: {this.state.selectedFile.name}</p>


<p>File Type: {this.state.selectedFile.type}</p>


<p>
              Last Modified:{" "}
              {this.state.selectedFile.lastModifiedDate.toDateString()}
            </p>

          </div>
        );
      } else {
        return (
          <div>
            <br />
            <h4>Choose before Pressing the Upload button</h4>
          </div>
        );
      }
    };

    render() {

      return (
        <div>
            <h1>
              FWB
            </h1>
            <h3>
              Upload file to mint!
            </h3>
            <div>
                <input type="file" onChange={this.onFileChange} />
                <button onClick={this.onFileUpload}>
                  Mint!
                </button>
            </div>
          {this.fileData()}
        </div>
      );
    }
  }

  export default Uploader;
