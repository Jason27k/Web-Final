# Web Development Final Project - Album Reviewer

Submitted by: Jason Morales

This web app: That uses the Spotify API to listen to previews of songs and rate albums 

Time spent: **6** hours spent in total

## Required Features

The following **required** functionality is completed:

- [X] **A create form that allows the user to create posts**
- [X] **Posts have a title and optionally additional textual content and/or an image added as an external image URL**
- [X] **A home feed displaying previously created posts**
- [X] **By default, the time created, title, and number of upvotes for each post is shown on the feed**
- [X] **Clicking on a post shall direct the user to a new page for the selected post**
- [X] **Users can sort posts by either their created time or upvotes count**
- [X] **Users can search for posts by title**
- [X] **A separate post page for each created post, where any additional information is shown is linked whenever a user clicks a post**
- [X] **Users can leave comments underneath a post on the post's separate page**
- [X] **Each post should have an upvote button on the post's page. Each click increases its upvotes count by one and users can upvote any number of times**
- [X] **A previously created post can be edited or deleted from its post page**

## Video Walkthrough

Here's a walkthrough of implemented user stories:

<img src='./Walkthrough.gif' title='Video Walkthrough' width='' alt='Video Walkthrough' />

## Notes

I discovered last minute that Spotify's Client API defaults to Development Mode. This setting necessitates the whitelisting of all users. Consequently, failure to whitelist a user results in their inability to access albums or listen to songs. The sole workaround is to submit an Extension Request, a process that requires some time(weeks to months) for processing. Due to the project's tight deadline and my belated awareness of these restrictions, I couldn't get the request processed in time. As a result, the Spotify functionality will remain unavailable unless I manually add the user to the whitelist.

## License

    Copyright 2023 Jason Morales

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.
