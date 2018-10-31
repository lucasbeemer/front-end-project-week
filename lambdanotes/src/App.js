import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './App.css';
import Route from 'react-router-dom/Route';
import NoteList from './Components/NoteList';
import NoteView from './Components/NoteView';
import AddNote from './Components/AddNote';
import EditNote  from './Components/EditNote';
import axios from 'axios';
 
class App extends Component {
  constructor() {
    super();
    this.state = {
      notes: [],
      id: '',
      title: '',
      content: '',
      showModal: false
    }
  }

  componentDidMount() {
    this.getNotes();
  }

  getNotes = () => {
    console.log("getting notes?", this.state);
    axios.get('http://localhost:7000/api/notes')
    .then(response => this.setState({ ...this.state, notes: response.data }))
    .catch(error => console.log(error));
  }

  handleInputChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  addNewNote = event => {
    event.preventDefault();
    const notes = this.state.notes.slice();
    notes.push({ 
      id: Number(Date.now().toString().slice(-2)), 
      title: this.state.title, 
      content: this.state.content 
    });
    this.setState({ 
      notes, 
      id: '',
      title: '',
      content: '' 
    });
  }

  editNoteSubmit = (noteID, title, content) => {
    this.setState(function (prevState) {
      return {
        notes: prevState.notes.map(note => noteID === note.id ? {id: noteID, title, content} : note )
      }
    } );
 }

  deleteNote = id => {
   let notes = this.state.notes.slice();
   notes = notes.filter(note => note.id !== id);
   this.setState({ notes, id: '', title: '', content: ''  });
  }

  modalToggle = () => {
    this.setState(function(prevState) {
      return {showModal: !prevState.showModal}
      })
      this.forceUpdate();
  }

  render() {
    return (
      <div className="App">
        <div className="Nav-bar">
          <h1 className="App-title">Lambda <br/> Notes</h1>
          <Link to="/notes" ><div className="nav-button" >View Your Notes</div ></Link>
          <Link to="/add" ><div className="nav-button" >+ Create New Note</div></Link>
        </div>
        <div className="display-right" >
          <Route exact path="/notes" render={props => 
            (<NoteList {...props} 
              notes={this.state.notes} />)} />
          <Route exact path="/notes/:id" render={props => 
            (<NoteView {...props} 
              notes={this.state.notes} 
              modalToggle={this.modalToggle} 
              showModal={this.state.showModal} 
              deleteNote={this.deleteNote} /> )} />
          <Route exact path="/add" render={props => 
            (<AddNote {...props} 
              notes={this.state.notes} 
              handleInputChange={this.handleInputChange} 
              inputTitle={this.state.title} 
              inputText={this.state.content} 
              addNewNote={this.addNewNote} /> ) } />
          <Route exact path="/notes/:id/edit" render={props => 
            (<EditNote {...props} 
              notes={this.state.notes} 
              editNoteSubmit={this.editNoteSubmit} />)}  />
        </div>
      </div>
    );
  }
}

export default App;