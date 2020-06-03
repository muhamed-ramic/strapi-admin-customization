import React from "react";
import { connect } from "react-redux";
import cheerio from "cheerio";
import renderHTML from "react-render-html";

const renderHtmlInDOM = (result = []) => {
  if (result) {
    if (result.length > 1) {
      return result.map((item) => {
        return renderHTML(String(item));
      });
    } else {
      return renderHTML(String(result))
    }
  }
};

class Custom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url: "",
      selector: "h1",
      selectorLink: "a",
      selectorImg: "img",
      selectorTxt: "p",
      result: [],
      validate: true,
      loader: "none"
   };
 }

  setStateForInput(name, event) {
    console.log(event);
    if (event.code != "Backspace") {
      this.setState({
        [name]: event.target.value
      });
    }
  }
   validate(url, selector, selectorType) {
    const selectorRegex = new RegExp(/^[a-z]{1,3}[0-9]?[.#]\w+\s?[.]?\w+/);
    const urlRegex = new RegExp(/(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/);
    let selectorHTMl = "";

    switch(selectorType) {
      case "title":
        selectorHTMl = "h1"
        break;
      case "link":
        selectorHTMl = "a"
        break;
      case "image":
        selectorHTMl = "img"
        break;
      case "text":
        selectorHTMl = "p"
        break;
    }
    if (!selectorRegex.test(selector) || !urlRegex.test(url)) {
      alert("Type in valid css selector and url.");
      this.setState({
        validate: false
      });
      return;
    }
    this.setState({
      validate: true
    });
  };

  scrape() {
    this.setState({
      loader: "block"
    });

    if (this.state.validate) {
      fetch(`https://cors-anywhere.herokuapp.com/${this.state.url}`)
      .then(response=>response.text())
      .then(text => {
        if (text) {
          let result = [], data = {}, selector = this.state.selector, selectorLink = this.state.selectorLink,
          selectorImg = this.state.selectorImg, selectorText = this.state.selectorTxt,
          selectors = [selector, selectorLink, selectorImg, selectorText];
          const $ = cheerio.load(text);

          //Search all enetered inputs in dom of remote url
         for (const value of selectors) {
          result = $(value).toArray();
          let html = result.map(r => $(r).html());
          let key = Object.keys(selectors).filter(k => selectors[k] == value).pop();

          data[key] = html.shift();
         }
         let post = {
           content: data[3],
           title: data[0],
           image: data[2],
           external_url: this.state.url
         }
         const formData = new FormData();

         formData.append('data', JSON.stringify(post));
         //add to table
         fetch("http://localhost:1337/content-manager/explorer/application::post.post", {
           headers: {
           },
           method: 'POST',
           body: formData
         }).then(result => {
           if (result.ok) {
            alert("Saved scraped parts of website into the table");
           }
         })

          let stateResult = [...this.state.result, data];
          this.setState({
            result: Array.from(new Set(stateResult))
          });
          console.log(this.state.result);
        }
      })
      .catch(error => {
        console.log('greska');
      })

      this.setState({
        loader: "none"
      });
    }
  }

  render() {
    let url = this.state.url;
    let that = this;
    let selector = this.state.selector;
    let selectorLink = this.state.selectorLink;
    let selectorImg = this.state.selectorImg;
    let selectorText = this.state.selectorTxt;

    let result = this.state.result;
    const returned = renderHtmlInDOM(result);

    const inputStyle = {
     padding: "5px",
     margin: "5px",
     width: "50%"
    };

    const spacerStyle = {
      marginTop: "18px"
    };

    let loaderStyle = {
      display: this.state.loader,
      position: "absolute",
      left: "50%",
      borderRadius: "50%",
      width: "40px",
      height: "40px",
      backgroundColor: "gray",
      borderTop: "1px solid black",
      transition: "0.5s all"
    };

    return (
      <div>
        <h1>Search here any site's title, image, text using css selector e.g class or id selector</h1>
        <div style={loaderStyle}></div>
        <div>
          <form style={{ border: "1px solid black", width: "100%", position: "relative" }}>
            <input
              type="url"
              style={inputStyle}
              value={url}
              placeholder="type url here (http/s ...)"
              onChange={event => that.setStateForInput("url", event)}
            />
            <div style={spacerStyle} />
            <input
              type="text"
              style={inputStyle}
              pattern="/^[.]\w+\s?[.]?\w+/"
              placeholder="css selector title (. #)"
              onChange={event =>
                that.setStateForInput("selector", event)
              }
              onBlur = {event => {
                that.validate(url, selector, "title")
              }}
              value={selector}
            />
              <input
              type="text"
              style={inputStyle}
              pattern="/^[.]\w+\s?[.]?\w+/"
              placeholder="css selector link (. #)"
              onChange={event =>
                that.setStateForInput("selectorLink", event)
              }
              onBlur = {event => {
                that.validate(url, selectorLink, "link")
              }}
              value={selectorLink}
            />
            <div style={ spacerStyle } />
            <input
              type="text"
              style={inputStyle}
              pattern="/^[.]\w+\s?[.]?\w+/"
              placeholder="css selector image (. #)"
              onChange={event =>
                that.setStateForInput("selectorImg", event)
              }
              onBlur = {event => {
                that.validate(url, selectorImg, "image")
              }}
              value={selectorImg}
            />
            <div style={ spacerStyle } />
            <input
              type="text"
              style={inputStyle}
              pattern="/^[.]\w+\s?[.]?\w+/"
              placeholder="css selector text (. #)"
              onChange={event =>
                that.setStateForInput("selectorTxt", event)
              }
              onBlur = {event => {
                that.validate(url, selectorText, "text")
              }}
              value={selectorText}
            />
            <div style={spacerStyle}></div>
            <input type="submit" onClick={event =>{
             event.preventDefault();
             that.scrape();
            }}/>

          </form>
          <div>
             Result: {
               returned!=null && returned !=undefined ?
                Object.keys(returned).map(key => <div>{returned[key]}</div>): "Empty"
              }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  console.log(state);
  return {
    data: state.get('content-manager_listView')
  };
};
export default connect(mapStateToProps)(Custom);
