import React, { Component } from 'react';
import './App.css';
import LoaderButton from "./components/LoaderButton";

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userID: -2,
            isLoading: false,
            isValidMove: false,
            gameInfo: [],
            gameID: -1,
            BUID: -1,
            bPresent: true,
            WUID: -1,
            wPresent: true,
            boardState: [[],[],[],[],[],[],[],[]],
            validMoves: [[],[],[],[],[],[],[],[]],
            gameState: ""
        };
    }

    async componentDidMount() {
        /*return fetch()
            .then(response => response.json())
            .then(responseJson => this.setState({
                gameInfo: responseJson
            }))
            .then(() => this.setState({
                gameID: this.state.gameInfo.id,
                BUID: this.state.gameInfo.blackUserID,
                WUID: this.state.gameInfo.whiteUserID,
                bPresent: this.state.gameInfo.blackUserPresent,
                wPresent: this.state.gameInfo.whiteUserPresent,
                boardState: this.boardStringToState(this.state.gameInfo.boardState),
                gameState: this.state.gameInfo.gameState
            }))
            .then(() => console.log(this.state.gameInfo))
            .then(() => this.setState({isLoading: false}));
        */
        this.setState({
            gameID: 0,
            BUID: 0,
            WUID: -1,
            bPresent: true,
            wPresent: true,
            gameState: "TB",
            userID: 0,
            boardState: this.boardStringToState("RNBQKBNRPPPPPPPP                                pppppppprnbqkbnr")
        })
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
        if(this.state.userID === this.state.BUID){
            if(this.state.gameState === "TB"){
                return this.state.isValidMove;
            }else{ return false; }
        }else if(this.state.userID === this.state.WUID){
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
        console.log(url);
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
