import React, { Component } from 'react';

import {
  getQuestionDataToRender,
  createQuestionRequest,
  deleteByIdReqest
} from './AppActions';
class App extends Component {
  state = {
    hasDataBeenQueried: 'N',
    data: [],
    id: 0,
    message: null,
    questionTextToAdd: null,
    answerToAdd: null,
    distractorsToAdd: null,
    intervalIsSet: false,
    idToDelete: null,
    idToUpdate: null,
    objectToUpdate: null
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
    const questionData = await getQuestionDataToRender();
    this.setState({ data: questionData });
    this.setState({ hasDataBeenQueried: 'Y' });
  };

  handleCreateQuestion = async (
    questionTextToAdd,
    answerToAdd,
    distractorsToAdd
  ) => {
    let response = await createQuestionRequest(
      questionTextToAdd,
      answerToAdd,
      distractorsToAdd
    );
    this.showResponse(response);
    this.getDataFromDb();
  };

  handleDeleteById = async idToDelete => {
    // let jsonString = JSON.stringify({ id: idToDelete });
    let response = await deleteByIdReqest(idToDelete);
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
        <ul>
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
        <div style={{ padding: '10px' }}>
          <input
            type='text'
            onChange={e => this.setState({ questionTextToAdd: e.target.value })}
            placeholder='Question Text to Add'
            style={{ width: '200px' }}
          />
          <input
            type='text'
            onChange={e => this.setState({ answerToAdd: e.target.value })}
            placeholder='Answer'
            style={{ width: '200px' }}
          />
          <input
            type='text'
            onChange={e => this.setState({ distractorsToAdd: e.target.value })}
            placeholder='distractorsToAdd'
            style={{ width: '200px' }}
          />
          <button
            onClick={() =>
              this.handleCreateQuestion(
                this.state.questionTextToAdd,
                this.state.answerToAdd,
                this.state.distractorsToAdd
              )
            }
          >
            ADD
          </button>
        </div>
        <div style={{ padding: '10px' }}>
          <input
            type='text'
            style={{ width: '200px' }}
            onChange={e => this.setState({ idToDelete: e.target.value })}
            placeholder='put id of item to delete here'
          />
          <button onClick={() => this.handleDeleteById(this.state.idToDelete)}>
            DELETE
          </button>
        </div>
        <div style={{ padding: '10px' }}>
          <button onClick={() => this.getDataFromDb()}>FETCH DATA</button>
        </div>
      </div>
    );
  }
}

export default App;
