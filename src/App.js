import logo from './logo.svg';
import './App.css';
import React from "react";
import web3 from "./web3";
import minter from './minter';
import fwb from './fwb';
import Uploader from './Uploader';
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js';
import { File } from 'web3.storage/dist/bundle.esm.min.js';
function getAccessToken() {
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGVkNmZkZkJCZUMxNkU1ZjcwOEI4M2Y1QjNhMzM5MzBDRTkxMGFGMDEiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Mjg0OTA2NzY0MzAsIm5hbWUiOiJFdGhpb3BpYXYxIn0.Ny7MnwcSNRv3GEZeQLZmrZNZ4_L3Cac-F_mi9XEh2fg';
}
function makeStorageClient() {
  return new Web3Storage({ token: getAccessToken() })
}

class App extends React.Component {constructor(props) {
    super(props);
  this.state = {
    file: '',
    imagePreviewUrl: '',
    bal: false,
    fwb: '',
    contents: '',
    cid: '',
    value: '',
    name: '',
    selectedFile: ''
  };
}

  async componentDidMount() {
    const name = await minter.methods.name().call();
    const accounts = await web3.eth.getAccounts();
    const bal = await fwb.methods.balanceOf(accounts[0]).call();
    if (bal >= 75000000000000000000) {
      this.setState({fwb: "Hello, looks like you have 75 $FWB tokens!  Mint at your leisure!"});
      this.setState({bal:true});
    } else {
      this.setState({fwb: "Sorry, you don't have 75 $FWB in your wallet.  If you'd like to mint an NFT you'll need to acquire some..."});
      this.setState({bal:false})
    }
    //const baseURL = hash.replace("ifps://", "https://") + ".ipfs.dweb.link/image.png";
    //this.setState({baseURL:baseURL});
    //console.log(baseURL);
};
getBlob = async () => {
  const blob = await new Promise(resolve => this.state.selectedFile.toBlob(resolve, 'image/png'));
  console.log(blob);
  const file = [new File([blob], "image.png", {type: "image/png"})];
  const client = makeStorageClient();
  this.setState({message: "Storing image to IPFS/Filecoin"})
  const cid = await client.put(file);
  console.log('stored files with cid:', cid);
  this.setState({cid: cid});
  this.setState({message: "Success...  Minting your NFT..."})
  const accounts = await web3.eth.getAccounts();
  await minter.methods.mint(cid, accounts[0]).send({
    from: accounts[0]
  });
  this.setState({message: "Nice!  We did it!"});
};

onSubmit = async (event) => {
  event.preventDefault();
  this.getBlob();
};


  render() {
    return (
      <div className="main">
      <div>{this.state.fwb}</div>
<Uploader />
<div className="contractInfo"><h2>fwb minter</h2>
</div>
</div>
    );
  };
}
export default App;
