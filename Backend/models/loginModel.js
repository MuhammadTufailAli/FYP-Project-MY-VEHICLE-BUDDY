const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: [true, "User must have FirstName"],

      trim: true,
    },
    lastname: {
      type: String,
      required: [true, "User must have LastName"],

      trim: true,
    },
    role: {
      type: String,
      enum: ["Customer", "admin", "ShopOwner", "Mechanic"],
      default: "user",
    },
    email: {
      type: String,
      required: [true, "User must have Email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
      trim: true,
    },
    password: {
      type: String,
      required: [true, "User must have Email"],
      minlength: 8,
      trim: true,
      select: false,
    },
    confirmPassword: {
      type: String,
      required: [true, "User must have Email"],
      validate: {
        // this only works on SAVE!!!
        validator: function (el) {
          return el === this.password; //if password === confirm password return true
        },
        message: "Passwords are not same",
      },
      trim: true,
    },
    photoUrl: {
      type: String,
      default:
        "https://res.cloudinary.com/vehiclebuddy/image/upload/v1665413220/rgyax6nangke0c7ssg5c.jpg",
    },
    earning: {
      type: Number,
      required: [true, "It should have earning"],
      default: 0,
    },
    cnic: {
      type: Number,
      min: [13, "Cnic must be 13 digit not less"],
      maxlength: [13, "Cnic must be 13 digit not more"],
    },

    phonenumber: {
      type: Number,
      minlength: [11, "phoneNumber must be 11 digit not less"],
      maxlength: [11, "phoneNumber must be 11 digit not more"],
    },
    telephonenumber: {
      type: Number,
      minlength: [7, "phoneNumber must be 7 digit not less"],
      maxlength: [7, "phoneNumber must be 7 digit not more"],
    },
    shop: {
      type: String,
      default: "No Shop",
    },
    shopname: {
      type: String,
    },
    shopaddress: {
      type: String,
    },
    permanentaddress: {
      type: String,
    },

    // I commented it out now
    // photo: {
    //   type: String,
    //   default: 'default.jpg',
    // },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    // Account activate or deactivate karna k liya
    active: {
      type: String,
      default: "active",
    },
  },
  {
    toJSON: { virtuals: true }, //it is imp when we are doing referencing
    toObject: { virtuals: true },
  }
);
//password encryption it will occure between when we get data and before saving it to db
userSchema.pre("save", async function (next) {
  // password is not modified so don't encrypt password again
  if (!this.isModified("password")) return next();

  // we will use bcrypt
  //hash the password
  this.password = await bcrypt.hash(this.password, 12);
  //we will delete confirm password field because we validated password and confirm passsword before and after conformation we don't need it any more so we deleted it
  this.confirmPassword = undefined;
  next();
});

//virtual populate
userSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "refOfUser",
  localField: "_id",
});

//Change the passwordChangedAt property
//jaha jaha mongoose save use kar raha ha controller ma us save sa phly ya execute ho
userSchema.pre("save", function (next) {
  //agr apssword change na hova ho ya phr password new ho
  if (!this.isModified("password") || this.isNew) return next();

  // - 1000 is liya likha ha q k kabhi asa hota ha k token phly create ho jata ha or time bad ma set hota ha is liya problem ati ha
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Ya middelware check kara ga k user ka active status kya ha
// /^find/ is liya use kiya k jaga jaga mongoose find ya findById wagara jo chheza find sa start ho rahi ha use kara raha ho us sa phly ya use ho
// hum sirf vo find kara ga jis ma active true ho ga
userSchema.pre(/^find/, function (next) {
  // this point to current query

  next();
});

//check password is correct
//candidatePassword jo password db ma ha
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//user change password before or after token was generated
userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changeTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    console.log(changeTimeStamp, JWTTimestamp);
    return JWTTimestamp < changeTimeStamp;
  }

  // False mean not changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  // we encrypt the token
  //this ka mtlb ha k jis document sa hum na createPasswordResetToken ko access kiya ha us k passwordResetToken ki value set kar do
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // passwordResetExpires ka time 10 min ho
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  // we send unencrypted token so that the token in db is encrypted and send to user is unencrypted
  return resetToken;
};

const user = mongoose.model("User", userSchema); // it will create a collection with userSchema
module.exports = user;
