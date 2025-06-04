const { Storage } = require("@google-cloud/storage")
const path = require("path")
require('dotenv').config({ path: '../.env' });

// Inicjalizacja Google Cloud Storage
const storage = new Storage({
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
    keyFilename: process.env.GOOGLE_CLOUD_KEY_FILE,
})

// Nazwa bucket'a
const bucketName = process.env.GOOGLE_CLOUD_STORAGE_BUCKET

// Sprawdzenie czy bucket istnieje
const initializeBucket = async () => {
    try {
        const bucket = storage.bucket(bucketName)
        const [exists] = await bucket.exists()

        if (!exists) {
            console.error(`Bucket ${bucketName} does not exist`)
            process.exit(1)
        }

        console.log(`Connected to Google Cloud Storage bucket: ${bucketName}`)
        return bucket
    } catch (error) {
        console.error("Error connecting to Google Cloud Storage:", error)
        process.exit(1)
    }
}

// Upload pliku do GCS
const uploadToGCS = async (buffer, fileName, mimetype) => {
    try {
        const bucket = storage.bucket(bucketName)
        const file = bucket.file(fileName)

        const stream = file.createWriteStream({
            metadata: {
                contentType: mimetype,
                cacheControl: "public, max-age=31536000", // Cache na rok
            },
            public: true, // Plik będzie publicznie dostępny
            // predefinedAcl: 'uniform'
        })

        return new Promise((resolve, reject) => {
            stream.on("error", (error) => {
                console.error("Upload stream error:", error)
                reject(error)
            })

            stream.on("finish", async () => {
                try {
                    // Ustawienie publicznego dostępu
                    await file.makePublic()

                    // Zwrócenie publicznego URL
                    const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`

                    resolve({
                        fileName,
                        publicUrl,
                        gcsFileName: fileName,
                    })
                } catch (error) {
                    console.error("Error making file public:", error)
                    reject(error)
                }
            })

            stream.end(buffer)
        })
    } catch (error) {
        console.error("Error uploading to GCS:", error)
        throw error
    }
}

// Usuwanie pliku z GCS
const deleteFromGCS = async (fileName) => {
    try {
        const bucket = storage.bucket(bucketName)
        const file = bucket.file(fileName)

        const [exists] = await file.exists()
        if (exists) {
            await file.delete()
            console.log(`File ${fileName} deleted from GCS`)
        }
    } catch (error) {
        console.error("Error deleting from GCS:", error)
        throw error
    }
}

// Sprawdzenie czy plik istnieje w GCS
const fileExistsInGCS = async (fileName) => {
    try {
        const bucket = storage.bucket(bucketName)
        const file = bucket.file(fileName)
        const [exists] = await file.exists()
        return exists
    } catch (error) {
        console.error("Error checking file existence:", error)
        return false
    }
}

module.exports = {
    storage,
    bucketName,
    initializeBucket,
    uploadToGCS,
    deleteFromGCS,
    fileExistsInGCS,
}