import React, { Component } from 'react';

import {
  createQuestionRequest,
  deleteByIdReqest,
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
    displayData: [],
    fetchDataCount: 0,
    id: 0,
    message: null,
    questionTextToAdd: null,
    answerToAdd: null,
    distractorsToAdd: null,
    fetchQuestionContains: null,
    idsToDelete: null,
    backendFileList: ['Hit List button to see list of files']
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

  handleGetDataFromDb = async () => {
    const questionData = await getQuestionDataToRender(
      this.state.fetchQuestionContains
    );
    let questionDataDisplay = questionData.slice(0, MAX_QUESTIONS_TO_DISPLAY);
    this.setState({ displayData: questionDataDisplay });
    this.setState({ fetchDataCount: questionData.length });
    this.setState({ hasDataBeenQueried: 'Y' });
  };

  handleListDataFiles = async () => {
    const response = await getFileListRequest(this.state.filenameToLoad);
    console.log(response);
    this.setState({ backendFileList: response});
  };

  handleLoadFromFile = async () => {
    const response = await loadFromFileRequest(this.state.filenameToLoad);
    this.showResponse(response);
    this.handleGetDataFromDb();
  };

  handleCreateQuestion = async () => {
    let response = await createQuestionRequest(
      this.state.questionTextToAdd,
      this.state.answerToAdd,
      this.state.distractorsToAdd
    );
    this.showResponse(response);
    this.handleGetDataFromDb();
  };

  handleDeleteDisplayedRecs = async () => {
    let displayData = this.state.displayData;
    let idsToDelete = [];
    for (let x = 0; x < displayData.length; x++) {
      idsToDelete.push(displayData[x]._id);
    }
    let response = await deleteByIdReqest(idsToDelete);
    this.showResponse(response);
    this.handleGetDataFromDb();
  };

  render() {
    if (this.state.hasDataBeenQueried === 'N') {
      this.handleGetDataFromDb();
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
                  <span style={titleStyle}> text: </span> {dat.questionText}
                  <span style={titleStyle}> answer: </span> {dat.answer}{' '}
                  <span style={titleStyle}> distractors: </span>{' '}
                  {dat.distractors}
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
            onChange={e => this.setState({ questionTextToAdd: e.target.value })}
            style={{ width: '200px' }}
          />
          <input
            id='Add.answer'
            placeholder='Answer'
            type='text'
            onChange={e => this.setState({ answerToAdd: e.target.value })}
            style={{ width: '200px' }}
          />
          <input
            id='Add.distractors'
            placeholder='Distractors'
            type='text'
            onChange={e => this.setState({ distractorsToAdd: e.target.value })}
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
        <ul id='Display-files'>
          { backendFileList.map(dat => (
                <p style={{ 'line-height': 1.0 }} key={dat}>
                  <span style={titleStyle}> file: </span>
                  {dat}}{dat.distractors}
                </p>
              ))}
        </ul>
      </div>
    );
  }
}

export default App;
