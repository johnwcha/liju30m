const functions = require('firebase-functions')
const admin = require('firebase-admin')
const cors = require('cors')({ origin: true })
// const serviceAccount = require('./liju30m-firebase-service-account.json')
// const serviceAccount = require('./liju30m-dialogflow-service.json')
admin.initializeApp()

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://liju30m-default-rtdb.firebaseio.com"
// });

const projectId = 'rugged-alloy-354219'
const keyFilename = './rugged-alloy.json'
// const keyFilename = './liju30m-dialogflow-service.json'
// const location = 'global'
const agentId = '783d094c-70b8-4acf-9ee1-a8d071ccd7d7'
// const query = 'I would like to buy t-shirt'
const languageCode = 'en'

// projects/rugged-alloy-354219/locations/us-central1/agents/783d094c-70b8-4acf-9ee1-a8d071ccd7d7
// import API library
const { SessionsClient } = require('@google-cloud/dialogflow-cx')

// if regional endpoint
const location = 'us-central1'
// const client = new SessionsClient({apiEndpoint: 'us-central1-dialogflow.googleapis.com'})

// const client = new SessionsClient({ auth: serviceAccount, apiEndpoint: 'us-central1-dialogflow.googleapis.com' })
// const client = new SessionsClient({ keyFilename: './liju30m-dialogflow-service.json', apiEndpoint: 'us-central1-dialogflow.googleapis.com' })
const client = new SessionsClient({ projectId: projectId, keyFilename: keyFilename, apiEndpoint: 'us-central1-dialogflow.googleapis.com' })
// agent link: https://dialogflow.cloud.google.com/cx/projects/rugged-alloy-354219/locations/us-central1/agents/783d094c-70b8-4acf-9ee1-a8d071ccd7d7

// exports.dialogflowGateway = functions.https.onRequest((req, resp) => {
exports.dialogflowGateway = functions.https.onCall(async (data, context) => {
  // This will log the params objects passed from frontend
  // console.log('Query Params:', request.query)
  // resp.set('Access-Control-Allow-Origin', '*')
  // functions.logger.info(req)
  // cors(req, resp, async () => {
  functions.logger.info(context.auth.token.email, {structuredData: true})
  functions.logger.info(data, {structuredData: true})

  // const sessionId = Math.random().toString(36).substring(7)
  const sessionPath = client.projectLocationAgentSessionPath(projectId, location, agentId, data.sessionId)
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: data.stt,
      },
      languageCode,
    },
  }
  // const { queryInput, sessionId } = request.body
  const [response] = await client.detectIntent(request)
  let result = { message: [], intent: '', page: '', payload: {}}

  for (const message of response.queryResult.responseMessages) {
    if (message.text) {
      console.log(`Agent Response: ${message.text.text}`)
      result.message.push(message.text.text)
    }
    // https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#google.protobuf.Value
    if (message.payload) {
      result.payload = message.payload
    }
  }
  if (response.queryResult.match.intent) {
    console.log(
      `Matched Intent: ${response.queryResult.match.intent.displayName}`
    )
    result.intent = response.queryResult.match.intent.displayName
  }
  console.log(
    `Current Page: ${response.queryResult.currentPage.displayName}`
  )
  result.page = response.queryResult.currentPage.displayName

  // const sessionClient = new SessionsClient({ credential: serviceAccount })
  // const session = sessionClient.sessionPath('liju30m', sessionId)

  // const responses = await sessionClient.detectIntent({ session, queryInput })
  // const result = responses[0].queryResult
  // const result = response.queryResult
  functions.logger.info(response, {structuredData: true})
  // resp.send({ data: result })
  return result
})
// })


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.helloWorld = functions.https.onCall((data, context) => {
  functions.logger.info(data.text, {structuredData: true})
  functions.logger.info(context.auth.token.email, {structuredData: true})
  return { data: 'Hello from Firebase Cloud!' }
})
/*
exports.helloWorld = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    functions.logger.info("Hello logs!", {structuredData: true})
    response.send({ data: 'Hello from Firebase Cloud!' })
  })
}) */
