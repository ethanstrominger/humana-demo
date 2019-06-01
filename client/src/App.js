import React, { Component } from 'react';

import {
  createQuestionRequest,
  deleteByIdsReqest,
  deleteAllRequest,
  getFileListRequest,
  getQuestionDataToRender,
  loadFromFileRequest
} from './AppRequests';
const MAX_QUESTIONS_TO_DISPLAY = 10;
const MAX_QUESTIONS_TO_FETCH = 100;
class App extends Component {
  state = {
    hasDataBeenQueried: 'N',
    filenameToLoad: null,
    isFilesListed: 'N',
    displayData: [],
    fetchDataCount: 0,
    id: 0,
    message: null,
    codeToAdd: null,
    nameToAdd: null,
    doseToAdd: null,
    fetchQuestionContains: null,
    idsToDelete: null,
    backendFileList: ['Hit List button to see list of files']
  };

  handleCreateQuestion = async () => {
    let response = await createQuestionRequest(
      this.state.codeToAdd,
      this.state.nameToAdd,
      this.state.doseToAdd
    );
    this.showResponse(response);
    this.handleGetDataFromDb();
  };

  handleDeleteAll = async () => {
    await deleteAllRequest();
    this.handleGetDataFromDb();
  };

  handleDeleteDisplayedRecs = async () => {
    let displayData = this.state.displayData;
    let idsToDelete = [];
    for (let x = 0; x < displayData.length; x++) {
      idsToDelete.push(displayData[x]._id);
    }
    let response = await deleteByIdsReqest(idsToDelete);
    this.showResponse(response);
    this.handleGetDataFromDb();
  };

  handleGetDataFromDb = async () => {
    const questionData = await getQuestionDataToRender(
      this.state.fetchQuestionContains
    );
    let questionDataDisplay = questionData.slice(0, MAX_QUESTIONS_TO_DISPLAY);
    this.setState({ displayData: questionDataDisplay });
    this.setState({ fetchDataCount: questionData.length });
  };

  handleListDataFiles = async () => {
    const response = await getFileListRequest(this.state.filenameToLoad);
    console.log(response);
    this.setState({ backendFileList: response });
  };

  handleLoadFromFile = async () => {
    const response = await loadFromFileRequest(this.state.filenameToLoad);
    this.showResponse(response);
    this.handleGetDataFromDb();
  };

  showResponse = response => {
    if (!response.success) {
      let message = response.message;
      if (response.errorDetail) {
        console.log('Full error: ' + response.errorDetail);
        message = message + '  See console log for more detail.';
      }
      alert('Failed : ' + message);
    }
  };

  render() {
    if (this.state.hasDataBeenQueried === 'N') {
      this.handleGetDataFromDb();
      this.handleListDataFiles();
      this.setState({ hasDataBeenQueried: 'Y' });
    }
    const displayData = this.state.displayData;
    const titleStyle = { color: 'blue' };
    const displayCount = displayData.length;
    const fetchCount = this.state.fetchDataCount;
    const countMessage =
      displayCount +
      ' records displayed' +
      (fetchCount > MAX_QUESTIONS_TO_DISPLAY
        ? ' out of ' + fetchCount + ' records'
        : '') +
      (fetchCount >= MAX_QUESTIONS_TO_FETCH ? ' or more' : '');
    const backendFileList = this.state.backendFileList;
    return (
      <div>
        <ul id='Count-display'>
          <p>{countMessage}</p>
        </ul>
        <ul id='Display-records'>
          {displayData.length <= 0
            ? 'NO DB ENTRIES YET'
            : displayData.map(dat => (
                <p style={{ 'line-height': 1.0 }} key={dat._id}>
                  <span style={titleStyle}> id: </span> {dat._id}
                  <span style={titleStyle}> text: </span> {dat.code}
                  <span style={titleStyle}> name: </span> {dat.name}{' '}
                  <span style={titleStyle}> dose: </span> {dat.dose}
                </p>
              ))}
        </ul>
        <div id='Fetch-delete' style={{ padding: '10px' }}>
          <input
            placeholder='Question text contains'
            type='text'
            onChange={e =>
              this.setState({ fetchQuestionContains: e.target.value })
            }
            style={{ width: '200px' }}
          />
          <button
            id='Fetch-del.FetchButton'
            onClick={() => this.handleGetDataFromDb()}
          >
            FETCH
          </button>
          <button
            id='Fetch-del.DeleteButton'
            onClick={() =>
              this.handleDeleteDisplayedRecs(this.state.idsToDelete)
            }
          >
            DELETE
          </button>
        </div>
        <div id='Add' style={{ padding: '10px' }}>
          <input
            id='Add.question-text'
            placeholder='Question Text to Add'
            type='text'
            onChange={e => this.setState({ codeToAdd: e.target.value })}
            style={{ width: '200px' }}
          />
          <input
            id='Add.name'
            placeholder='name'
            type='text'
            onChange={e => this.setState({ nameToAdd: e.target.value })}
            style={{ width: '200px' }}
          />
          <input
            id='Add.dose'
            placeholder='dose'
            type='text'
            onChange={e => this.setState({ doseToAdd: e.target.value })}
            style={{ width: '200px' }}
          />
          <button onClick={() => this.handleCreateQuestion()}>ADD</button>
        </div>
        <div id='Load-file' style={{ padding: '10px' }}>
          <input
            placeholder='File name (must have been uploaded already)'
            type='text'
            onChange={e => this.setState({ filenameToLoad: e.target.value })}
            style={{ width: '200px' }}
          />
          <button
            id='Load-file.LoadButton'
            onClick={() => this.handleLoadFromFile()}
          >
            LOAD FILE
          </button>
          <button
            id='Load-file.LoadButton'
            onClick={() => this.handleListDataFiles()}
          >
            LIST FILES
          </button>
        </div>
        <div id='Delete-all' style={{ padding: '10px' }}>
          <button
            id='Delete-all.DeleteAllButton'
            onClick={() => this.handleDeleteAll()}
          >
            DELETE ALL
          </button>
        </div>
        <ul id='Display-files'>
          {backendFileList.map(dat => (
            <p style={{ 'line-height': 1.0 }} key={dat}>
              {dat}
            </p>
          ))}
        </ul>
      </div>
    );
  }
}

export default App;
