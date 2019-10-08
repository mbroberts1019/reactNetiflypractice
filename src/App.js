import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

export default function NetiflyFormExample() {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/form">Form</Link>
          </li>
          
        </ul>

        <hr />

        <Route exact path="/" component={Home} />
        <Route path="/form" component={Form} />
        
      </div>
    </Router>
  );
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function Form() {
  return (
    <div>
      <IdeaForm/>
    </div>
  );
}

const submitFormStyle = {padding: '20px'};

const encode = (data) => {
    return Object.keys(data)
        .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
        .join("&");
  };

 class IdeaForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = {name: '', idea: ''};
    }
  
    handleSubmit(e) {
        fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: encode({ "form-name": "submission", ...this.state.idea })
        })
          .then(() => alert("Success!"))
          .catch(error => alert(error));
  
        e.preventDefault();
      }
    
    
    handleChange(event) {
      this.setState({[event.target.name]: event.target.value});
    }
  
    onSubmit(event) {
      alert('An idea was submitted: ' + this.state.value);
      event.preventDefault();
    }
  
    render() {
      return (
        <div style = {submitFormStyle}>
                <label>
                    Have a great Idea?
                </label>
                <input type= 'text' value= {this.state.name} name= 'name' placeholder= 'Your Name'></input>
                <form onSubmit={(e) => this.onSubmit(e)}>
                    <textarea rows= "20" cols = "80" name= 'idea' value= {this.state.idea} id="submittedIdea" type="text" placeholder="Enter your idea here" onChange= {(e)=>this.handleChange(e)}></textarea><br></br>
                    <button type="submit">Submit</button>
                </form>
        </div>
           
    
      );
    }
  }

