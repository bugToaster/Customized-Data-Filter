### Deployment guideline


#### Assuming nodeJs >= 16 & npm >= 8 is available on your machine

1. Clone the codebase onto your machine
2. Run `npm install` to install all necessary dependencies
3. Modify `.env` file set port & upload_path where uploaded file will be stored
4. Run `npm start`
5. Open URL in browser `{{baseURL}}/service` this will appear a window with upload file option
6. After successful execution of above URL it will show a message like `File read successfully! Read complete 0000 bytes from file. Execution time: 0000ms`
7. Then hit the following URL on browser `{{baseURL}}/service/data-migration`


