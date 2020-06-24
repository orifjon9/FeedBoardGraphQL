import React, { Component } from 'react';

import Image from '../../../components/Image/Image';
import './SinglePost.css';

class SinglePost extends Component {
  state = {
    title: '',
    author: '',
    date: '',
    image: '',
    content: ''
  };

  componentDidMount() {
    const graphqlQuery = {
      query: `query {
        post(postId:"${this.props.match.params.postId}") {
          _id
          title
          content
          imageUrl
          creator {
            name
          }
          createdAt
          updatedAt
      }
    }`
    };
    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + this.props.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(graphqlQuery)
    })
      .then(res => {
        if (res.errors && res.errors[0].status !== 200) {
          throw new Error('Failed to fetch status');
        }
        return res.json();
      })
      .then(res => res.data)
      .then(resData => {
        console.log(resData);
        this.setState({
          title: resData.post.title,
          author: resData.post.creator.name,
          image: `http://localhost:4000/${resData.post.imageUrl}`,
          date: new Date(resData.post.createdAt).toLocaleDateString('en-US'),
          content: resData.post.content
        });
      })
      .catch(err => {
        console.log(err);
      });
  }

  render() {
    return (
      <section className="single-post">
        <h1>{this.state.title}</h1>
        <h2>
          Created by {this.state.author} on {this.state.date}
        </h2>
        <div className="single-post__image">
          <Image contain imageUrl={this.state.image} />
        </div>
        <p>{this.state.content}</p>
      </section>
    );
  }
}

export default SinglePost;
