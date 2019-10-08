import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import NetlifyForm from 'react-netlify-form';

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
      <Banner/>
      <IdeaForm/>
    </div>
  );
}

const submitFormStyle = {padding: '20px'};
const bannerStyle = {color: 'purple'};

const encode = (data) => {
    return Object.keys(data)
        .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
        .join("&");
  };

 
  class Banner extends React.Component{

    render(){
      return(
        <div style= {bannerStyle}>I Make Good Forms!!!</div>
      );
    }

  }
 
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
      alert( this.state.name + ' has an idea: ' + this.state.idea);
      event.preventDefault();
    }
  
    render() {
      return (
        
          
        <NetlifyForm name='Contact Form'>
        {({ loading, error, success }) => (
        <div>
            {loading &&
        <div>Loading...</div>
          }
         {error &&
            <div>Your information was not sent. Please try again later.</div>
          }
          {success &&
              <div>Thank you for contacting us!</div>
            }
            {!loading && !success &&
              <div>
             <input type='text' name='Name' required />
             <textarea name='Message' required />
             <button>Submit</button>
          </div>
        }
      </div>
        )}
        </NetlifyForm>


        // <div style = {submitFormStyle}>
        //         <form name= "cool form" onSubmit={(e) => this.onSubmit(e)} data-netlify="true">
        //           <label>
        //             Have a great Idea?
        //           </label>
        //           <input type= 'text' value= {this.state.name} name= 'name' placeholder= 'Your Name' onChange= {(e)=>this.handleChange(e)}></input>
                
        //             <textarea rows= "20" cols = "80" name= 'idea' value= {this.state.idea} id="submittedIdea" type="text" placeholder="Enter your idea here" onChange= {(e)=>this.handleChange(e)}></textarea><br></br>
        //             <button type="submit">Submit</button>
        //         </form>
        // </div>
           
    
      );
    }
  }

//   <form name="contact" method="POST" data-netlify="true">
//   <p>
//     <label>Your Name: <input type="text" name="name" /></label>   
//   </p>
//   <p>
//     <label>Your Email: <input type="email" name="email" /></label>
//   </p>
//   <p>
//     <label>Your Role: <select name="role[]" multiple>
//       <option value="leader">Leader</option>
//       <option value="follower">Follower</option>
//     </select></label>
//   </p>
//   <p>
//     <label>Message: <textarea name="message"></textarea></label>
//   </p>
//   <p>
//     <button type="submit">Send</button>
//   </p>
// </form>

