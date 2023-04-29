const { connect, set } = require('mongoose');

exports.connectDb = async () => {
    try {
        set('strictQuery', false);
        const {connection} = await connect(process.env.MONGO_URL);
        console.log('mongoose connected with '+connection.host);

    } catch (error) {
        console.log(error);
    }
}