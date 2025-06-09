Oauth Authorize
This endpoint returns the Authorization Window, which app users can use to authenticate their identity and grant your app permissions and short-lived Instagram User Access Tokens.

Creating
This operation is not supported.

Reading
GET /oauth/authorize

Get the Authorization Window.

Requirements
None.

Request Syntax
GET https://api.instagram.com/oauth/authorize
  ?client_id={app-id},
  &redirect_uri={redirect-uri},
  &response_type=code,
  &scope={scope}
Query String Parameters
Augment the request with the following query parameters.

Key	Sample Value	Description
client_id
Required
Numeric string

990602627938098

Your Instagram App ID displayed in App Dashboard > Products > Instagram > Basic Display.

redirect_uri
Required
String

https://socialsizzle.herokuapp.com/auth/

A URI where we will redirect users after they authenticate. Make sure this exactly matches one of the base URIs in your list of valid oAuth URIs. Keep in mind that the App Dashboard may have added a trailing slash to your URIs, so we recommend that you verify by checking the list.

response_type
Required
String

code

Set this value to code.

scope
Required
Comma-separated list

user_profile,user_media

A comma-separated list, or URL-encoded space-separated list, of permissions to request from the app user. user_profile is required.

state
String

1

An optional value indicating a server-specific state. For example, you can use this to protect against CSRF issues. We will include this parameter and value when redirecting the user back to you.

Response
The Authorization Window, which you should display to the app user. Once the user authenticates, the window will redirect to your redirect_uri and include an Authentication Code, which you can then exchange for a short-lived Instagram User Access Token.

Note that we #_ append to the end of the redirect URI, but it is not part of the code itself, so strip it out before exchanging it for a short-lived token.

HTTP Example
https://api.instagram.com/oauth/authorize
  ?client_id=990602627938098
  &redirect_uri=https://socialsizzle.herokuapp.com/auth/
  &scope=user_profile,user_media
  &response_type=code
Successful Authorization
If authentication is successful, the Authorization Window will redirect the user to your redirect_uri and include an Authorization Code. Capture the code so you can exchange it for a short-lived access token.

Codes are valid for 1 hour and can only be used once.

Sample Successful Authorization Redirect
https://socialsizzle.herokuapp.com/auth?code=AQBx-hBsH3...
Canceled Authorization
If the user cancels the authorization flow, we will redirect the user to your redirect_uri and append the following error parameters. It is your responsibility to fail gracefully in these situations and display an appropriate message to your users.

Parameter	Value
error

access_denied

error_reason

user_denied

error_description

The+user+denied+your+request

Sample Canceled Authentication Redirect
https://socialsizzle.herokuapp.com/auth/
  ?error=access_denied
  &error_reason=user_denied
  &error_description=The+user+denied+your+request

  Page
Represents a Facebook Page.

This node allows you to:

get the IG User connected to a Facebook Page.
Available via Facebook Login for Business only.

Creating
This operation is not supported.

Reading
Getting a Page's IG User
GET /<PAGE_ID>?fields=instagram_business_account

Returns the IG User connected to the Facebook Page.

Permissions
A Facebook User access token with the following permissions:

instagram_basic
pages_show_list
If the token is from a User whose Page role was granted via the Business Manager, one of the following permissions is also required:

ads_management
ads_read
Sample Request
GET graph.facebook.com
  /134895793791914?fields=instagram_business_account
Sample Response
{
  "instagram_business_account": {
    "id": "17841405822304914"
  },
  "id": "134895793791914"
}
Updating
This operation is not supported.

Deleting
This operation is not supported.

Refresh Access Token
This endpoint allows you to refresh long-lived Instagram User Access Tokens.

Creating
This operation is not supported.

Reading
GET /refresh_access_token

Refresh a long-lived accesstoken that is at least 24 hours old but has not expired. Refreshed tokens are valid for 60 days from the date at which they are refreshed.

Requirements
Type	Requirement
Access tokens)

Instagram User (long-lived)

Permissions

instagram_graph_user_profile

Request Syntax
GET https://graph.instagram.com/refresh_access_token
  ?grant_type=ig_refresh_token
  &access_token=<LONG_LIVED_ACCESS_TOKENS>
Query String Parameters
Include the following query string parameters to augment the request.

Key	Value
grant_type
Required
String

Set this to ig_refresh_token.

access_token
Required
String

The valid (unexpired) long-lived Instagram User Access Token that you want to refresh.

Response
A JSON-formatted object containing the following properties and values.

{
  "access_token": "<ACCESS_TOKEN>",
  "token_type": "<TOKEN_TYPE>",
  "expires_in": <EXPIRES_IN>
}
Response Contents

Value Placeholder	Value
<ACCESS_TOKEN>
Numeric string

A long-lived Instagram User Access Token.

<TOKEN_TYPE>
String

bearer

<EXPIRES_IN>
Integer

The number of seconds until the long-lived token expires.

cURL Example
Request
curl -X GET \
  'https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&&access_token=F4RVB...'
Response
{
  "access_token": "c3oxd...",
  "token_type": "bearer",
  "expires_in": 5183944
}
Updating
This operation is not supported.

Deleting
This operation is not supported.

