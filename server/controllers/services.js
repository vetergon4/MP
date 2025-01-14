const db = require('../models');
const User = require('../models/Users.js')(db.sequelize, db.Sequelize);
const Service = require('../models/Service.js')(db.sequelize, db.Sequelize);
const Sequelize = require('sequelize');
//Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const addService = (req, res) => {
  const idUsera = req.body.idUsera;
  if (idUsera) {
    User.findByPk(idUsera).then((user) => {
      if (!user) {
        res.status(404).json({ message: "This user doesn't exist" });
      } else {
        // Check if user has a vessel
        if (user.vessel <= 0 || user.vessel == null) {
          return res.status(400).json({ message: "User doesn't have a vessel" });
        }

        const type = req.body.type;

        if (type === "berth") {
          // Check if user already has an active berth service
          const twentyFourHoursAgo = new Date(new Date() - 24 * 60 * 60 * 1000);

          Service.findOne({
            where: {
              user: idUsera,
              type: "berth",
              createdAt: { [Sequelize.Op.gte]: twentyFourHoursAgo }
            }
          }).then((existingService) => {
            if (existingService) {
              return res.status(400).json({ message: "You already have an active berth service." });
            } else {
              // Check if the buoy is available - service must be created less than 24 hours ago
              Service.findOne({
                where: {
                  buoy: req.body.buoy,
                  type: "berth",
                  createdAt: { [Sequelize.Op.gte]: twentyFourHoursAgo }
                }
              }).then((existingBuoyService) => {
                if (existingBuoyService) {
                  return res.status(400).json({ message: "This buoy is already taken." });
                } else {
                  // Create new berth service
                  Service.create({
                    type: type,
                    user: idUsera,
                    vessel: user.vessel,
                    buoy: req.body.buoy,
                    status: "DONE",
                    price: 50,
                  })
                    .then((newService) => {
                      res.status(200).json({ message: "Service added successfully", service: newService });
                    })
                    .catch((err) => {
                      console.error('Error saving service:', err);
                      res.status(500).json({ message: err.message });
                    });
                }
              });
            }
          });
        } else if (type == "fuel" || type == "trashwaste") {
          // Check if there's an existing berth service for this user
          Service.findOne({
            where: {
              user: idUsera,
              type: "berth",
            },
          }).then((service) => {
            if (!service) {
              return res.status(400).json({ message: "You can't add a service of type fuel or trashwaste without a service of type berth" });
            } else {
              // Create service of type fuel or trashwaste
              Service.create({
                type: type,
                user: idUsera,
                vessel: user.vessel,
                buoy: req.body.buoy,
                status: "PENDING",
                price: 0,
              })
                .then((newService) => {
                  res.status(200).json({ message: "Service added successfully", service: newService });
                })
                .catch((err) => {
                  console.error('Error saving service:', err);
                  res.status(500).json({ message: err.message });
                });
            }
          });
        } else {
          res.status(400).json({ message: "Service type can only be berth, fuel or trashwaste" });
        }
      }
    }).catch((err) => {
      console.error('Error finding user:', err);
      res.status(500).json({ message: err.message });
    });
  } else {
    res.status(400).json({ message: "Id parameter of user wasn't issued." });
  }
};



const updateServiceStatus = (req, res) => {
  const idService = req.params.idService;
  const status = req.body.status;

  //if status is DONE or PENDING proceed, else return error
  if (status !== "DONE" && status !== "PENDING") {
    return res.status(400).json({ message: "Status can only be DONE or PENDING" });
  }

  if (!idService) {
    return res.status(400).json({ message: "Id parameter of service wasn't issued." });
  }

  Service.findByPk(idService)
    .then((service) => {
      if (!service) {
        return res.status(404).json({ message: "This service doesn't exist" });
      }

      service.status = status;
      return service.save();
    })
    .then((updatedService) => {
      res.status(200).json({ message: "Service status updated successfully", service: updatedService });
    })
    .catch((error) => {
      console.error("Error updating service status:", error);
      res.status(500).json({ message: "An error occurred while updating service status" });
    });
};

//delete service
const deleteService = (req, res) => {
  const idService = req.params.idService;
  if (idService) {
    Service.findByPk(idService)
      .then((service) => {
        if (!service) {
          return res.status(404).json({ message: "This service doesn't exist" });
        }
        return service.destroy();
      })
      .then(() => {
        res.status(200).json({ message: "Service deleted successfully" });
      })
      .catch((error) => {
        console.error("Error deleting service:", error);
        res.status(500).json({ message: "An error occurred while deleting service" });
      });
  } else {
    res.status(400).json({ message: "Id parameter of service wasn't issued." });
  }
};


//get all Services of a user
const getServicesByUser = async (req, res) => {
  const idUsera = req.params.idUsera;
  if (idUsera) {
    Service.findAll({
      where: {
        user: idUsera,
      },
    })
      .then((userServices) => {
        if (userServices.length === 0) {
          res.status(404).json({ sporocilo: "No services found for this user" });
        } else {
          res.status(200).json(userServices);
        }
      })
      .catch((error) => {
        console.error('Error fetching services:', error);
        res.status(500).json({ message: error.message });
      });
  } else {
    res.status(400).json({ sporocilo: "Id parameter of user wasn't issued." });
  }
};

//get services by type (berth, fuel, trash waste)
const getServicesByType = (req, res) => {
  const type = req.params.type;
  if (type) {
    Service.findAll({
      where: {
        type: type,
      },
    }).then((Services) => {
      res.status(200).json(Services);
    });
  } else {
    res.status(400).json({ sporocilo: "Type parameter wasnt issued." });
  }
};

//const get services that have PENDING status attr
const getPendingServices = (req, res) => {
  Service.findAll({
    where: {
      status: "PENDING",
    },
  }).then((Services) => {
    res.status(200).json(Services);
  });
};

//const getServices, get all services
const getServices = (req, res) => {
  Service.findAll().then((Services) => {
    res.status(200).json(Services);
  });
};


//find berth service of a user and return it
const getBerthService = (req, res) => {
  const idUsera = req.params.idUsera;
  if (idUsera) {
    Service.findOne({
      where: {
        user: idUsera,
        type: "berth",
      },
    }).then((berthService) => {
      if (!berthService) {
        res.status(404).json({ message: "No berth service found for this user" });
      } else {
        res.status(200).json(berthService);
      }
    });
  } else {
    res.status(400).json({ message: "Id parameter of user wasn't issued." });
  }
};

// Stripe post payment request
const stripePayment = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).send({ error: 'Amount is required' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // amount in cents
      currency: 'eur',
      payment_method_types: ['card'],
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const stripeCheckoutSession = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      console.error('Amount is required but not provided');
      return res.status(400).send({ error: 'Amount is required' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Product Name',
          },
          unit_amount: amount,
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `${process.env.CORS_ORIGIN}/profile`, 
      cancel_url:  `${process.env.CORS_ORIGIN}/profile`,
    });

    console.log('Stripe session created:', session.id);
    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    res.status(500).json({ error: error.message });
  }
};


module.exports = {
  addService,
  updateServiceStatus,
  deleteService,
  getServicesByUser,
  getServicesByType,
  getPendingServices,
  getServices,
  getBerthService,
  stripePayment,
  stripeCheckoutSession,
};  