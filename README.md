# Video Upload App with Instagram Integration

This project is a web application that allows users to upload videos to an AWS S3 bucket and integrate with Instagram for content management. It is built using Next.js and TypeScript, and it utilizes Tailwind CSS for styling.

## Features

- Instagram Business Login (OAuth 2.0)
- Video upload functionality to AWS S3
- Instagram content publishing
- Progress bar to indicate upload status
- Responsive design
- Secure authentication without next-auth

## Project Structure

```
video-upload-app
├── src
│   ├── app
│   │   ├── page.tsx          # Main entry point of the application
│   │   ├── upload
│   │   │   └── page.tsx      # Upload page for video uploads
│   │   └── layout.tsx        # Layout component for consistent styling
│   ├── components
│   │   ├── VideoUpload.tsx    # Component for handling video uploads
│   │   └── ProgressBar.tsx     # Component for displaying upload progress
│   ├── lib
│   │   ├── aws-config.ts      # AWS configuration settings
│   │   └── upload-utils.ts     # Utility functions for upload process
│   └── types
│       └── index.ts           # TypeScript types and interfaces
├── public                      # Directory for static assets
├── package.json                # npm configuration file
├── tsconfig.json              # TypeScript configuration file
├── tailwind.config.js         # Tailwind CSS configuration
├── next.config.js             # Next.js configuration file
└── README.md                  # Project documentation
```

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd video-upload-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Instagram App:
   - Go to [Meta for Developers](https://developers.facebook.com/)
   - Create a new app and add Instagram product
   - Configure Instagram Business Login
   - Add redirect URI: `http://localhost:3000/api/auth/instagram/callback`

4. Create environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Then fill in your Instagram and AWS credentials:
   ```env
   INSTAGRAM_CLIENT_ID=your_instagram_app_id
   INSTAGRAM_CLIENT_SECRET=your_instagram_app_secret
   NEXT_PUBLIC_INSTAGRAM_REDIRECT_URI=http://localhost:3000/api/auth/instagram/callback
   AWS_BUCKET_NAME=your_s3_bucket
   AWS_ACCESS_KEY_ID=your_aws_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret
   AWS_REGION=us-east-1
   ```

5. Run the application:
   ```bash
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:3000` to access the application.

## Instagram Integration

This app uses Instagram Business Login with the following scopes:
- `instagram_business_basic` - Access basic account info
- `instagram_business_content_publish` - Publish content
- `instagram_business_manage_messages` - Manage messages
- `instagram_business_manage_comments` - Manage comments

**Requirements:**
- Instagram Business or Creator account
- Account must not require Page Publishing Authorization (PPA)

## Usage

- Click on the "Upload" link to navigate to the upload page.
- Select a video file and click the upload button.
- Monitor the upload progress with the progress bar.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes."# testproj" 
