import axios from 'axios';
import crypto from "crypto";
import db from '../models/index.js';

const { Idea } = db;

const PAYMOB_API_KEY = process.env.PAYMOB_API_KEY;
const PAYMOB_API_URL = process.env.PAYMOB_API_URL;
const PAYMOB_INTEGRATION_ID = process.env.PAYMOB_INTEGRATION_ID;




export const getAuthToken = async () => {
    const response = await axios.post(`${PAYMOB_API_URL}/auth/tokens`, {
        api_key: PAYMOB_API_KEY,
    });
    return response.data.token;
};

export const createOrder = async (authToken, amount) => {
    const response = await axios.post(
        `${PAYMOB_API_URL}/ecommerce/orders`,
        {
            auth_token: authToken,
            delivery_needed: "false",
            amount_cents: amount * 100, 
            currency: "EGP",
            items: [],
        }
    );

    return response.data.id; 
};

export const createPaymentKey = async (authToken, orderId, amount, userData) => {
    const response = await axios.post(
        `${PAYMOB_API_URL}/acceptance/payment_keys`,
        {
            auth_token: authToken,
            amount_cents: amount * 100,
            expiration: 3600,
            order_id: orderId,
            billing_data: {
                first_name: userData.firstName || "Customer",
                last_name: userData.lastName || "User",
                phone_number: userData.phone || "01000000000",
                email: userData.email || "customer@example.com",
                country: "EG",
                city: "Cairo",
                street: "Na",
                building: "Na",
                floor: "Na",
                apartment: "Na",
            },
            currency: "EGP",
            integration_id: PAYMOB_INTEGRATION_ID,
        }
    );
    return response.data.token; 
};

export const verifyHmac = (query, hmacSecret) => {
    const {
        amount_cents,
        created_at,
        currency,
        error_occured,
        has_parent_transaction,
        id,
        integration_id,
        is_3d_secure,
        is_auth,
        is_capture,
        is_refunded,
        is_standalone_payment,
        is_voided,
        order,
        owner,
        pending,
        source_data,
        success
    } = query;

    const dataString = [
        amount_cents,
        created_at,
        currency,
        error_occured,
        has_parent_transaction,
        id,
        integration_id,
        is_3d_secure,
        is_auth,
        is_capture,
        is_refunded,
        is_standalone_payment,
        is_voided,
        order.id,
        owner,
        pending,
        source_data.pan,
        source_data.sub_type,
        source_data.type,
        success
    ].join('');

    const hashed = crypto
        .createHmac('sha512', hmacSecret)
        .update(dataString)
        .digest('hex');

    return hashed === query.hmac;
};


export const finalizePurchase = async (userId, ideaId) => {
  const transaction = await db.connection.transaction();

  try {
    console.log("Inputs received -> userId:", userId, "| ideaId:", ideaId);

    const purchasedIdea = await db.connection.models.Idea.findByPk(Number(ideaId), { transaction });

    if (!purchasedIdea) {
      throw new Error("Idea not found in the database.");
    }

    const targetSolutionName = purchasedIdea.solutionName;

    const deletedCount = await db.connection.models.usersSavedIdeas.destroy({
      where: {
        ideaId: Number(ideaId),
        userId: {
          [db.Sequelize.Op.ne]: Number(userId),
        },
      },
      transaction,
      logging: console.log,
    });

    console.log(`# of deleted saved ideas is ${deletedCount}`);

    const similarIdeas = await db.connection.models.Idea.findAll({
      where: {
        solutionName: targetSolutionName,
        id: {
          [db.Sequelize.Op.ne]: Number(ideaId),
        },
        messageId: {
          [db.Sequelize.Op.not]: null,
        },
      },
      attributes: ["messageId"],
      transaction,
    });

    const messageIdsToUpdate = similarIdeas.map((idea) => idea.messageId);

    if (messageIdsToUpdate.length > 0) {
      const updatedMessages = await db.connection.models.Message.update(
        {
          content: "This idea has been purchased by another user and is no longer available.",
          is_idea: false,
          is_full_idea: false,
        },
        {
          where: {
            id: {
              [db.Sequelize.Op.in]: messageIdsToUpdate,
            },
          },
          transaction,
        }
      );

      console.log(`# of updated messages is ${updatedMessages[0]}`);
    }

    await transaction.commit();
    console.log("Purchase finalized and messages updated successfully.");

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Error while updating idea records:", error);
    throw error;
  }
};