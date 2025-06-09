Yes, it's possible to integrate an Instagram account into an app, but it's not a direct, simple process. You need to use the Instagram API, specifically the Graph API, and follow the OAuth flow for authentication. This allows users to log in to your app using their Instagram credentials and grant your app permission to access their account. 
Here's a breakdown of the integration process:
1. Create an App with Instagram API:
You'll need to register an app with the Instagram Platform (Meta for Developers). 
2. Choose the Right API:
For most applications, the Graph API is the recommended approach, especially if you need to manage content, comments, or direct messages. 
3. Implement OAuth Flow:
This is how users authorize your app to access their Instagram account. Your app will redirect the user to an Instagram login page, they'll grant permission, and then be redirected back to your app. 
4. Access Instagram Data:
Once the user has authorized your app, you can use the Graph API to access their profile information, media, comments, and other data. 
5. Build Your App:
Use the access token obtained through OAuth to make API calls and integrate the data into your app's functionality. 
Key Considerations:
Business Accounts:
The Instagram API is primarily designed for Instagram Professional accounts (Business or Creator accounts). 
Permissions:
You need to request the necessary permissions from the user during the OAuth flow. This determines what your app can access. 
App Review:
Depending on the permissions you request, your app may need to be reviewed by Meta for Developers before it can be deployed. 
Terms of Service:
Always adhere to Instagram's Terms of Service and API guidelines. 


Instagram API with Instagram Login
The Instagram API with Instagram Login allows Instagram professionals — businesses and creators — to use your app to manage their presence on Instagram. The API can be used to:

Instagram Media Insights are now available for Instagram API with Instagram Login. Learn more.

Comment moderation – Manage and reply to comments on their media
Content publishing – Get and publish their media
Media Insights - Get insights on their media
Mentions – Identify media where they have been @mentioned by other Instagram users
Messaging – Send and receive messages with customers or people interested in their Instagram account
Note: This API setup does not require a Facebook Page to be linked to the Instagram professional account.

To ensure consistency between scope values and permission names, we are introducing new scope values for the Instagram API with Instagram login. The new scope values are:

instagram_business_basic
instagram_business_content_publish
instagram_business_manage_messages
instagram_business_manage_comments
These will replace the existing business_basic, business_content_publish, business_manage_comments and business_manage_messages scope values, respectively.

Please note that the old scope values will be deprecated on January 27, 2025. It is essential to update your code before this date to avoid any disruption in your app's functionality. Failure to do so will result in your app being unable to call the Instagram endpoints.

Limitations
This API setup cannot access ads or tagging.
Next Steps
Next, read the Overview to learn about the core concepts, components, and usage requirements for this API.

Business Login for Instagram
Business Login is a custom login flow that allows your app to ask for permissions to access your app user's Instagram professional account data and to get an access token to use in your app's API requests.

To ensure consistency between scope values and permission names, we are introducing new scope values for the Instagram API with Instagram login. The new scope values are:

instagram_business_basic
instagram_business_content_publish
instagram_business_manage_messages
instagram_business_manage_comments
These will replace the existing business_basic, business_content_publish, business_manage_comments and business_manage_messages scope values, respectively.

Please note that the old scope values will be deprecated on January 27, 2025. It is essential to update your code before this date to avoid any disruption in your app's functionality. Failure to do so will result in your app being unable to call the Instagram endpoints.

How it works
Your app user launches the login flow on your app or website by clicking your embed URL link or button. This embed URL, that you set up in the App Dashboard with the permissions you are requesting from your app users, opens an authorization window. Your app user uses this window to grant your app permissions. When the user submits the login flow, Meta redirects your app user to your redirect URI and sends an authorization code. Your app can then exchange this authorization code for a short-lived Instagram User access token, an Instagram-scoped user ID for your app user, and a list of permissions the app user granted your app. Your app can exchanged this short-lived access token for a long-lived Instagram user access token that is valid for 60 days.

Before you start
If you haven't already, add the Instagram product to your app and configure your Business login settings in the Meta App Dashboard.

Embed the business login URL
You should have completed this step during Instagram app setup in the App Dashboard, but if not, complete the following steps.

Copy the Embed URL from the Set up business login in the App Dashboard.
Paste the URL in an anchor tag or button on your app or website to launch the login flow.
Requirements
This guide assumes you have read the Instagram Platform Overview and implemented the needed components for using this API, such as a Meta login flow and a webhooks server to receive notifications.

You will need the following:

Access Level
Advanced Access if your app serves Instagram professional accounts you don't own or manage
Standard Access if your app serves Instagram professional accounts you own or manage and have added to your app in the App Dashboard
Endpoints
https://www.instagram.com/oauth/authorize – To get an authorization code from your app user
https://api.instagram.com/oauth/access_token – To exchange an authorization code for a short-lived access token
https://graph.instagram.com/access_token – To exchange a valid short-lived access token for a long-lived access token
https://graph.instagram.com/refresh_access_token – To refresh a valid long-lived access token for another 60 days
IDs from the Meta App Dashboard
In the App Dashboard > Instagram > API setup with Instagram login > 3. Set up Instagram business login > Business login settings, you will need:

Your app's Instagram App ID
Your app's Instagram App Secret
Step 1. Get authorization
When a person clicks your embed URL link or button to log in to your app, they are directed to an authorization window. This window allows your app users to grant your app permissions and short-lived Instagram User access tokens.

Example embed URL
Formatted for readability.

https://www.instagram.com/oauth/authorize
  ?client_id=990602627938098
  &redirect_uri=https://my.m.redirect.net/
  &response_type=code
  &scope=
    instagram_business_basic,
    instagram_business_manage_messages,
    instagram_business_manage_comments,
    instagram_business_content_publish
Query string parameters
Parameter	Description
client_id
Required
Numeric string

Your app's Instagram App ID displayed in App Dashboard > Instagram > API setup with Instagram login > 3. Set up Instagram business login > Business login settings > Instagram App ID.

enable_fb_login
boolean

Value can be 0 or 1. When set to 1: Allows an app user, whose Facebook Page is linked to their Instagram professional account and who is already logged in to Facebook, to log in to your app. When set to 0: Forces an app user to log in with their Instagram professional account credentials even if logged into Instagram. Use in conjunction with force_authentication set to 1.

force_authentication
boolean

Value can be 0 or 1. When set to 1: Forces an app user use their Instagram professional account credentials to log into your app even if logged into Instagram. Use in conjunction with enable_fb_login set to 0. When set to 0: Allows an app user who is logged into their Instagram account.

redirect_uri
Required
String

A URI where we will redirect users after they allow or deny permission request. Make sure this exactly matches one of the base URIs in your list of valid OAuth URIs you set during API setup in the App Dashboard. Keep in mind that the App Dashboard might have added a trailing slash to your URIs, so we recommend that you verify by checking the list. App Dashboard > Instagram > API setup with Instagram login > 3. Set up Instagram business login > Business login settings> OAuth redirect URIs.

response_type
Required
String

Set this value to code.

scope
Required
List

A comma-separated or URL-encoded space-separated list of permissions to request from the app user.

state
String

An optional value indicating a server-specific state. For example, you can use this to protect against CSRF issues. We will include this parameter and value when redirecting the user back to you.

Successful authorization
If authorization is successful, we will redirect your app user to your redirect_uri and pass you an Authorization Code through the code query string parameter. This code is valid for 1 hour and can only be used once.

Capture the code so your app can exchange it for a short-lived Instagram User access token.

Example redirect URI response
https://my.m.redirect.net/?code=abcdefghijklmnopqrstuvwxyz#_
NOTE: The #_ appended to the end of the redirect URI is not part of the code itself, so strip it out.

Canceled authorization
If the user cancels the authorization flow, we will redirect the user to your redirect_uri and attach the following error parameters. It is your responsibility to fail gracefully in these situations and display an appropriate message to your app users.

Parameter	Value
error

access_denied

error_reason

user_denied

error_description

The+user+denied+your+request

Sample Canceled Authorization Redirect
Formatted for readability.

https://my.m.redirect.net/auth/
  ?error=access_denied
  &error_reason=user_denied
  &error_description=The+user+denied+your+request
Step 2. Exchange the Code For a Token
To get the access token, send a POST request to the https://api.instagram.com/oauth/access_token endpoint with the following parameters:

client_id set to your app's Instagram app ID from the App Dashboard
client_secret set to your app's Instagram App Secret from the App Dashboard
grant_type set to authorization_code
redirect_uri set to your redirect URI
code set to the code value from the redirect URI response
Sample request
Formatted for readability.

curl -X POST https://api.instagram.com/oauth/access_token \
  -F 'client_id=990602627938098' \
  -F 'client_secret=a1b2C3D4' \
  -F 'grant_type=authorization_code' \
  -F 'redirect_uri=https://my.m.redirect.net/' \
  -F 'code=AQBx-hBsH3...'
On success, your app receives a JSON response containing the app user's short-lived access token, their Instagram App-scoped User ID, and a list of the permissions granted by the app user.

{
  "data": [
    {
      "access_token": "EAACEdEose0...", 
      "user_id": "1020...",                // Your app user's Instagram-scoped user ID
      "permissions": "instagram_business_basic,instagram_business_manage_messages,instagram_business_manage_comments,instagram_business_content_publish"
    }
  ]
}         
Capture the access_token value. This is the user’s short-lived Instagram User access token which your app can use to access Instagram API with Instagram Login endpoints.

Parameter reference
Parameter	Sample Value	Description
client_id
Required
Numeric string

990602627938098

Your app's Instagram App ID displayed in App Dashboard > Instagram > API setup with Instagram login > 3. Set up Instagram business login > Business login settings > Instagram App ID.

client_secret
Required
String

a1b2C3D4

Your Instagram App Secret displayed in App Dashboard > Instagram > API setup with Instagram login > 3. Set up Instagram business login > Business login settings > Instagram app secret.

code
Required
String

AQBx-hBsH3...

The authorization code we passed you in the code parameter when redirecting the user to your redirect_uri.

grant_type
Required
String

authorization_code

Set this value to authorization_code.

redirect_uri
Required
String

https://my.m.redirect.net/

The redirect URI you passed us when you directed the user to our Authorization Window. This must be the same URI or we will reject the request. App Dashboard > Instagram > API setup with Instagram login > 3. Set up Instagram business login > Business login settings> OAuth redirect URIs.

Sample Rejected Response
If the request is malformed in some way, the API will return an error.

{
  "error_type": "OAuthException",
  "code": 400,
  "error_message": "Matching code was not found or was already used"
}
Step 3. Get a long-lived access token
You can exchange your app user's short-lived access token for a long-lived access token that is valid for 60 days.

Requirements
The short-lived access token must be valid (not expired)
Requests for long-lived tokens must be made in server-side code. These requesting include your app secret which you never want to expose in client-side code or in an app binary that could be decompiled. Do not share your app secret with anyone, expose it in code, send it to a client, or store it in a device.
To get a long-lived access token, send a GET request to the /access_token endpoint with the following parameters:

grant_type set to ig_exchange_token
client_secret set to your Instagram app secret
Your app user's valid (unexpired) short-lived Instagram user access token
Sample Requests
Formatted for readability.

curl -i -X GET "https://graph.instagram.com/access_token
  ?grant_type=ig_exchange_token
  &client_secret=a1b2C3D4
  &access_token=EAACEdEose0..."
On success, your app receives a JSON response with your app user's long-lived access token, the token type, and the expiration.

{
  "access_token":"EAACEdEose0...",
  "token_type": "bearer",
  "expires_in": 5183944  // Number of seconds until token expires
}
Refresh a long-lived token
Your app user's long-lived access token can be refreshed for another 60 days as long as the existing conditions are true:

The existing long-lived access token is at least 24 hours old
The existing long-lived access token is valide (not expired)
The app user has granted your app the instagram_business_basic permission
Tokens that have not been refreshed in 60 days will expire and can no longer be refreshed.

To exchange your app user's long-lived token that is set to expire, send a GET request to the /refresh_access_token endpoint with the following parameters:

grant_type set to ig_refresh_token
access_token set to the long-lived access token that is about to expire
Sample Requests
Formatted for readability.

curl -i -X GET "https://graph.instagram.com/refresh_access_token
  ?grant_type=ig_refresh_token
  &access_token=EAACEdEose0..."
On success, your app receives a JSON response with your app user's long-lived access token, the token type, and the expiration.

{
  "access_token":"EAACEdEose0...",
  "token_type": "bearer",
  "expires_in": 5183944  // Number of seconds until token expires
}



Content Publishing
This guide shows you how to publish single images, videos, reels (single media posts), or posts containing multiple images and videos (carousel posts) on Instagram professional accounts using the Instagram Platform.

On March 24, 2025, we introduced the new alt_text field for image posts on the /<INSTAGRAM_PROFESSIONAL_ACCOUNT_ID>/media endpoint. Reels and stories are not supported.

Requirements
This guide assumes you have read the Instagram Platform Overview and implemented the needed components for using this API, such as a Meta login flow and a webhooks server to receive notifications.

Media on a public server
We cURL media used in publishing attempts, so the media must be hosted on a publicly accessible server at the time of the attempt.

Page Publishing Authorization
An Instagram professional account connected to a Page that requires Page Publishing Authorization (PPA) cannot be published to until PPA has been completed.

It's possible that an app user may be able to perform Tasks on a Page that initially does not require PPA but later requires it. In this scenario, the app user would not be able to publish content to their Instagram professional account until completing PPA. Since there's no way for you to determine if an app user's Page requires PPA, we recommend that you advise app users to preemptively complete PPA.

You will need the following:

Instagram API with Instagram Login	Instagram API with Facebook Login
Access Levels

Advanced Access
Standard Access
Advanced Access
Standard Access
Access Tokens

Instagram User access token
Facebook Page access token
Host URL

graph.instagram.com

graph.facebook.com rupload.facebook.com (For resumable video uploads)

Login Type

Business Login for Instagram

Facebook Login for Business

Permissions	
instagram_business_basic
instagram_business_content_publish
instagram_basic
instagram_content_publish
pages_read_engagement
If the app user was granted a role on the Page connected to your app user's Instagram professional account via the Business Manager, your app will also need:

ads_management
ads_read
Webhooks

Endpoints
/<IG_ID>/media — Create media container and upload the media
upload_type=resumable — Create a resumbable upload session to upload large videos from an area with frequent network interruptions or other transmission failures. Only for apps that have implemented Facebook Login for Business.
/<IG_ID>/media_publish — publish uploaded media using their media containers.
/<IG_CONTAINER_ID>?fields=status_code — check media container publishing eligibility and status.
/<IG_ID>/content_publishing_limit — check app user's current publishing rate limit usage.

POST https://rupload.facebook.com/ig-api-upload/<IG_MEDIA_CONTAINER_ID> — Upload the video to Meta servers

GET /<IG_MEDIA_CONTAINER_ID>?fields=status_code — Check publishing eligibility and status of the video

HTML URL encoding troubleshooting
Some of the parameters are supported in list/dict format.
Some characters need to be encoded into a format that can be transmitted over the Internet. For example: user_tags=[{username:’ig_user_name’}] is encoded to user_tags=%5B%7Busername:ig_user_name%7D%5D where [ is encoded to %5B and { is encoded to %7B. For more conversions, please refer to the HTML URL Encoding standard.
Limitations
JPEG is the only image format supported. Extended JPEG formats such as MPO and JPS are not supported.
Shopping tags are not supported.
Branded content tags are not supported.
Filters are not supported.
For additional limitations, see each endpoint's reference.

Rate Limit
Instagram accounts are limited to 100 API-published posts within a 24-hour moving period. Carousels count as a single post. This limit is enforced on the POST /<IG_ID>/media_publish endpoint when attempting to publish a media container. We recommend that your app also enforce the publishing rate limit, especially if your app allows app users to schedule posts to be published in the future.

To check an Instagram professional account's current rate limit usage, query the GET /<IG_ID>/content_publishing_limit endpoint.

Create a container
In order to publish a media object, it must have a container. To create the media container and upload a media file, send a POST request to the /<IG_ID>/media endpoint with the following parameters:

access_token – Set to your app user's access token
image_url or video_url – Set to the path of the image or video. We will cURL your image using the passed in URL so it must be on a public server.
media_type — If the container will be for a video, set to VIDEO, REELS, or STORIES.
is_carousel_item – If the media will be part of a carousel, set to true
upload_type – Set to resumable, if creating a resumable upload session for a large video file
Visit the Instagram User Media Endpoint Reference for additional optional parameters.


Example Request
Formatted for readability.

curl -X POST "https://<HOST_URL>/<LATEST_API_VERSION>/<IG_ID>/media"
     -H "Content-Type: application/json" 
     -H "Authorization: Bearer <ACCESS_TOKEN>" 
     -d '{
           "image_url":"https://www.example.com/images/bronz-fonz.jpg"
         }'
On success, your app receives a JSON response with the Instagram Container ID.

{
  "id": "<IG_CONTAINER_ID>"  
}
Create a carousel container
To publish up to 10 images, videos, or a combination of the two, in a single post, a carousel post, you must create a carousel container. This carousel containter will contain a list of all media containers.

To create the carousel container, send a POST request to the /<IG_ID>/media endpoint with the following parameters:

media_type — Set to CAROUSEL. Indicates that the container is for a carousel.
children — A comma separated list of up to 10 container IDs of each image and video that should appear in the published carousel.

Limitations
Carousels are limited to 10 images, videos, or a mix of the two.
Carousel images are all cropped based on the first image in the carousel, with the default being a 1:1 aspect ratio.
Accounts are limited to 50 published posts within a 24-hour period. Publishing a carousel counts as a single post.
Example Request
Formatted for readability.

curl -X POST "https://graph.instagram.com/v23.0/90010177253934/media"
     -H "Content-Type: application/json" 
     -d '{  
           "caption":"Fruit%20candies"
           "media_type":"CAROUSEL"
           "children":"<IG_CONTAINER_ID_1>,<IG_CONTAINER_ID_2>,<IG_CONTAINER_ID_3>"
         }'
On success, your app receives a JSON response with the Instagram Carousel Container ID.

{
  "id": "<IG_CAROUSEL_CONTAINER_ID>" 
}
Resumable Upload Session
If you created a container for a resumable video upload in Step 1, your need to upload the video before it can be published.

Most API calls use the graph.facebook.com host however, calls to upload videos for Reels use rupload.facebook.com.

The following file sources are supported for uploaded video files:

A file located on your computer
A file hosted on a public facing server, such as a CDN
To start the upload session, send a POST request to the /<IG_MEDIA_CONTAINER_ID endpoint on the rupload.facebook.com host with the following parameters:

access_token
Sample request upload a local video file
With the ig-container-id returned from a resumable upload session call, upload the video.

Be sure the host is rupload.facebook.com.
All media_type shares the same flow to upload the video.
ig-container-id is the ID returned from resumable upload session calls.
access-token is the same one used in previous steps.
offset is set to the first byte being upload, generally 0.
file_size is set to the size of your file in bytes.
Your_file_local_path is set to the file path of your local file, for example, if uploading a file from, the Downloads folder on macOS, the path is @Downloads/example.mov.
curl -X POST "https://rupload.facebook.com/ig-api-upload/<API_VERSION>/<IG_MEDIA_CONTAINER_ID>`" \
     -H "Authorization: OAuth <ACCESS_TOKEN>" \
     -H "offset: 0" \
     -H "file_size: Your_file_size_in_bytes" \
     --data-binary "@my_video_file.mp4"
Sample request upload a public hosted video
curl -X POST "https://rupload.facebook.com/ig-api-upload/<API_VERSION>/<IG_MEDIA_CONTAINER_ID>`" \
     -H "Authorization: OAuth <ACCESS_TOKEN>" \
     -H "file_url: https://example_hosted_video.com"
Sample Response
// Success Response Message
{
  "success":true,
  "message":"Upload successful."
}

// Failure Response Message
{
  "debug_info":{
    "retriable":false,
    "type":"ProcessingFailedError",
    "message":"{\"success\":false,\"error\":{\"message\":\"unauthorized user request\"}}"
  }
}
Publish the container
To publish the media,

Send a POST request to the /<IG_ID>/media_publish endpoint with the following parameters:

creation_id set to the container ID, either for a single media container or a carousel container
Example Request
Formatted for readability.

    
curl -X POST "https://<HOST_URL>/<LATEST_API_VERSION>/<IG_ID>/media_publish"
     -H "Content-Type: application/json" 
     -H "Authorization: Bearer <ACCESS_TOKEN>"     
     -d '{
           "creation_id":"<IG_CONTAINER_ID>" 
         }'
On success, your app receives a JSON response with the Instagram Media ID.

{
  "id": "<IG_MEDIA_ID>"
}
Reels posts
Reels are short-form videos that appears in the Reels tab of the Instagram app. To publish a reel, create a container for the video and include the media_type=REELS parameter along with the path to the video using the video_url parameter.

If you publish a reel and then request its media_type field, the value returned is VIDEO. To determine if a published video has been designated as a reel, request its media_product_type field instead.

You can use the code sample on GitHub (insta_reels_publishing_api_sample) to learn how to publish Reels to Instagram.

Story posts
To publish a reel, create a container for the media object and include the media_type parameter set to STORIES.

If you publish a story and then request its media_type field, the value will be returned as IMAGE/VIDEO. To determine if a published image/video is a story, request its media_product_type field instead.

Troubleshooting
If you are able to create a container for a video but the POST /<IG_ID>/media_publish endpoint does not return the published media ID, you can get the container's publishing status by querying the GET /<IG_CONTAINER_ID>?fields=status_code endpoint. This endpoint will return one of the following:

EXPIRED — The container was not published within 24 hours and has expired.
ERROR — The container failed to complete the publishing process.
FINISHED — The container and its media object are ready to be published.
IN_PROGRESS — The container is still in the publishing process.
PUBLISHED — The container's media object has been published.
We recommend querying a container's status once per minute, for no more than 5 minutes.