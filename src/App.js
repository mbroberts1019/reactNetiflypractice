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
      <Banner />
      <IdeaForm />
    </div>
  );
}

const submitFormStyle = { padding: "20px" };
const bannerStyle = { color: "purple" };

const encode = data => {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
};

class Banner extends React.Component {
  render() {
    return <div style={bannerStyle}>I Make Good Forms!!!</div>;
  }
}

class IdeaForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { name: "", idea: "" };
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  onSubmit(event) {
    alert(
      this.state.name +
        " @ " +
        this.state.email +
        " has an idea: " +
        this.state.idea
    );

    fetch(
      "https://boring-brattain-746f09.netlify.com/.netlify/functions/storeIdea",
      {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: JSON.stringify({
          email: `${this.state.email}`,
          name: `${this.state.name}`,
          idea: `${this.state.idea}`
        })
      }
    );

    fetch(
      "https://boring-brattain-746f09.netlify.com/.netlify/functions/sendEmail",
      {
        method: "POST",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: JSON.stringify({
          email: `${this.state.email}`,
          name: `${this.state.name}`,
          idea: `${this.state.idea}`
        })
      }
    );

    event.preventDefault();
  }

  render() {
    return (
      <div style={submitFormStyle}>
        <form name="cool form" onSubmit={e => this.onSubmit(e)}>
          <label>Have a great Idea?</label>
          <br />
          <input
            type="text"
            value={this.state.name}
            name="name"
            placeholder="Your Name"
            onChange={e => this.handleChange(e)}
          ></input>{" "}
          <br />
          <input
            type="text"
            value={this.state.email}
            name="email"
            placeholder="awesomeperson@email.com"
            onChange={e => this.handleChange(e)}
          ></input>
          <br />
          <textarea
            rows="20"
            cols="80"
            name="idea"
            value={this.state.idea}
            id="submittedIdea"
            type="text"
            placeholder="Enter your idea here"
            onChange={e => this.handleChange(e)}
          ></textarea>
          <br></br>
          <button type="submit">Submit</button>
        </form>
      </div>
    );
  }
}
