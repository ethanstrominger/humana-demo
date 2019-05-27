import React, { Component } from 'react';

import {
  getQuestionDataToRender,
  createQuestionRequest,
  deleteByIdReqest
} from './AppRequests';
class App extends Component {
  state = {
    hasDataBeenQueried: 'N',
    data: [],
    id: 0,
    message: null,
    questionTextToAdd: null,
    answerToAdd: null,
    distractorsToAdd: null,
    fetchQuestionContains: null,
    idsToDelete: null
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

  getDataFromDb = async () => {
    const questionData = await getQuestionDataToRender(
      this.state.fetchQuestionContains
    );
    this.setState({ data: questionData });
    this.setState({ hasDataBeenQueried: 'Y' });
  };

  handleCreateQuestion = async () => {
    let response = await createQuestionRequest(
      this.state.questionTextToAdd,
      this.state.answerToAdd,
      this.state.distractorsToAdd
    );
    this.showResponse(response);
    this.getDataFromDb();
  };

  handleDeleteDisplayedRecs = async () => {
    let data = this.state.data;
    let idsToDelete = [];
    for (let x = 0; x < data.length; x++) {
      idsToDelete.push(data[x]._id);
    }
    let response = await deleteByIdReqest(idsToDelete);
    this.showResponse(response);
    this.getDataFromDb();
  };

  render() {
    if (this.state.hasDataBeenQueried === 'N') {
      this.getDataFromDb();
    }
    const data = this.state.data;
    const titleStyle = { color: 'blue' };
    return (
      <div>
        <ul id='Display-records'>
          {data.length <= 0
            ? 'NO DB ENTRIES YET'
            : data.map(dat => (
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
            onClick={() => this.getDataFromDb()}
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
        <div style={{ padding: '10px' }} />
      </div>
    );
  }
}

export default App;
