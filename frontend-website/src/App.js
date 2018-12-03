import React, { Component } from 'react';
import './App.css';
import LoaderButton from "./components/LoaderButton";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userName: "",
            isLoading: false,
            isValidMove: false,
            gameName: "",
            gameInfo: [],
            gameID: -1,
            blackUser: "",
            bPresent: true,
            whiteUser: "",
            wPresent: true,
            boardState: [[],[],[],[],[],[],[],[]],
            validMoves: [[],[],[],[],[],[],[],[]],
            gameState: ""
        };
    }

    getColor(){

    }

    async componentDidMount() {
        // {"name": "1v1 fite me", "black_user": "user", "black_present": true, "white_user":
        // "abc123", "white_present": true, "board_state": "RNBQKBNRPPPPPPPP                                pppppppprnbqkbnr",
        // "game_state": "TW"}
        let url = "/game/"+window.parent.game_id+"/data";
        console.log(url);
        try {
            return fetch(url)
                .then(response => response.json())
                .then(responseJson => this.setState({
                    gameInfo: responseJson
                }))
                .then(() => this.setState({
                    gameName: this.state.gameInfo.name,
                    blackUser: this.state.gameInfo.black_user,
                    whiteUser: this.state.gameInfo.white_user,
                    bPresent: this.state.gameInfo.black_present,
                    wPresent: this.state.gameInfo.white_present,
                    boardState: this.boardStringToState(this.state.gameInfo.board_state),
                    gameState: this.state.gameInfo.game_state
                }))
                .then(() => console.log(this.state.gameInfo))
                .then(() => this.setState({isLoading: false}));
        }catch(e){
            alert(e);
        }
        this.setState({
            gameID: window.parent.game_id,
            userName: window.parent.username
        });
        console.log(this.state.boardState);
        return true;
    }

    boardStringToState(board) {
        let boardStuff = this.state.boardState;
        for(let y=0; y<8; y++){
            for(let x=0; x<8; x++){
                boardStuff[x][y] = board[(y*8)+x];
            }
        }
        return boardStuff;
    }

    boardStateToString(boardState){
        let board = "";
        for(let y=0; y<8; y++){
            for(let x=0; x<8; x++){
                board = board + boardState[x][y];
            }
        }
        return board;
    }

    isMyTurn(){
        if(this.state.userName === this.state.blackUser){
            if(this.state.gameState === "TB"){
                return this.state.isValidMove;
            }else{ return false; }
        }else if(this.state.userName === this.state.whiteUser){
            if(this.state.gameState === "TW"){
                return this.state.isValidMove;
            }else{ return false; }
        }else{
            console.log("Error, invalid user for this game.")
            return false;
        }
    }

    validateForm() {
        return this.state.isValidMove;
    }
    handleSendMove = async event => {
        const confirmed = window.confirm(
            "Are you sure you want to send this move?"
        );
        if (!confirmed) { return; }
        this.setState({ isLoading: true });

        try {
            await this.sendMove();
            this.props.history.push("/");
        } catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    }
    sendMove() {
        let url = "";//"https://hz08tdry07.execute-api.us-east-2.amazonaws.com/prod/admin/?command=edit&id=" + (this.state.key);
        console.log(url);
        let data = {
            boardState: this.boardStateToString(this.state.boardState)
        };
        let outputData = JSON.stringify(data);
        console.log(outputData);
        return fetch(url, {
            method: "POST",
            body: outputData
        })
            .then(response => response.json())
            .then(response => console.log(response));
    }

    handleQuit = async event => {
        const confirmed = window.confirm(
            "Are you sure you want to send this move?"
        );
        if (!confirmed) { return; }
        this.setState({ isLoading: true });
        try {
            await this.quitGame();
            this.props.history.push("/");
        } catch (e) {
            alert(e);
            this.setState({ isLoading: false });
        }
    }
    quitGame() {
        let url = "";//"https://hz08tdry07.execute-api.us-east-2.amazonaws.com/prod/admin/?command=edit&id=" + (this.state.key);
        //console.log(url);
        let data = {

        };
        let outputData = JSON.stringify(data);
        console.log(outputData);
        return fetch(url, {
            method: "POST",
            body: outputData
        })
            .then(response => response.json())
            .then(response => console.log(response));
    }


    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <p>
                        Edit <code>src/App.js</code> and save to reload.
                    </p>
                    <a
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                </header>
                <form onSubmit={this.handleSendMove}>
                    <LoaderButton
                        block
                        bsStyle="primary"
                        bsSize="large"
                        disabled={!this.validateForm()}
                        type="submit"
                        isLoading={this.state.isLoading}
                        text="Send Move"
                        loadingText="Sending…"
                        className="but"
                    />
                </form>
                <form onSubmit={this.handleQuit}>
                    <LoaderButton
                        block
                        bsStyle="primary"
                        bsSize="large"
                        disabled={false}
                        type="submit"
                        isLoading={this.state.isLoading}
                        text="Quit game"
                        loadingText="Quitting…"
                        className="but"
                    />
                </form>
            </div>
        );
    }
}

export default App;
