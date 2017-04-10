import React, { Component } from 'react';

class Dashboard extends Component {

  render() {
    return (
      <div className="animated fadeIn">
            <h2 class="blog-post-title">Release 1.0</h2>
            <p class="blog-post-meta">Marck 28, 2017 by <a href="#">TeamRocket</a></p>

            <p>
                This is the release for prototype one. We sucessfully implemented the API from specification.
                Currently we are focusing on effeiciency and accuracy of our backend and improving our
                documentation.
            </p>
            <p>
                You may find instructions to use our API and integrate the module with your own system from our <a
                    href="http://45.76.114.158/doc">Documentation </a>. The input parameters are exactly like
                specification says.For output, we introduced headers to indicate errors.
            </p>
            <p>
                The test script was made by one of our team mate and here is it <a href="http://45.76.114.158/doc">File</a>
            </p>
            <ul>
                <li>Fix all reported unhandled exceptions.</li>
                <li>Fix error when parse state to export data.</li>
            </ul>

            <p>New Features</p>
            <ul>
                <li>If no data are in our databse, API returns you a error message instead of giving 404.</li>
            </ul>
            
            <h2 class="blog-post-title">Release 0.12</h2>
            <p class="blog-post-meta">Marck 26, 2017 by <a href="#">TeamRocket</a></p>

            <p>Bug Fix</p>
            <ul>
                <li>Now Merchandise Export data can be correctly requested.</li>
            </ul>

            <p>New Fetures</p>
            <ul>
                <li>Introducing header of response JSON. When the API finds errors in input parameter or our
                    database down, we would give you an indication in the header. for more details, please check the
                    new documentation.
                </li>
                <li>Introducing exception hanlding of our API. The API now always returns you a JSON fomat. Note:
                    There are still unkown exceptions and we are doing heavy tests on this.
                </li>
                <li>Introducing log file generation of our API. When you reports bugs , we now can check logs to see
                    what happens.
                </li>
            </ul>

            <h2 class="blog-post-title">Release 0.11</h2>
            <p class="blog-post-meta">Marck 24, 2017 by <a href="#">TeamRocket</a></p>

            <p>Bug Fix</p>
            <ul>
                <li>Fix OtherManucacturedArticles category as specification updated.</li>
            </ul>

            <p>New Fetures</p>
            <ul>
                <li>Introducing <a href="http://45.76.114.158/doc">Documentation </a>.You may find everything
                    related to the API input parameters here and we will keep it updating as we release new
                    features.
                </li>
            </ul>
      </div>
    )
  }
}

export default Dashboard;
