import mongoose from "mongoose";

const conectarBd = async () => {
  try {
    const connnection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const url = `${connnection.connection.host} : ${connnection.connection.port}`;
    console.log(`MongoDB conectado en ${url}`);
  } catch (error) {
    console.log(`Error : ${error.message}`);
    process.exit(1);
  }
};

export default conectarBd;
