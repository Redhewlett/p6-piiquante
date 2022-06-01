const Sauce = require("../models/Sauce");
// get access to file related operations
const fs = require("fs");

//======================get a clicked sauce=====================
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) =>
      res.status(404).json({ message: "couldn't load the good stuff" })
    );
};

//===============get all the sauces=================
exports.getAllSauces = (req, res, next) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

//==================create new sauce==============================
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  //delete the id given by the frontend since mongodb is handling that
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "New Hot stuff created!" }))
    .catch((error) => res.status(400).json({ error }));
};

//===========modify a sauce=====================
exports.modifySauce = (req, res, next) => {
  //if there is a file we create its name/path, if not we just take the req's body

  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() =>
      res.status(200).json({ message: "your bottle has been updated" })
    )
    .catch((error) =>
      res.status(403).json({
        error,
      })
    );
};

//==================delete a sauce=====================
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      //delete file then delete the object from the database
      fs.unlink(`./images/${filename}`, () => {
        //prevent people from deleting other's post (start)
        Sauce.findOne({ _id: req.params.id }).then((sauce) => {
          if (!sauce) {
            return res.status(404).json({
              error: new Error("Object not found"),
            });
          }
          if (sauce.userId !== req.auth.userId) {
            return res.status(401).json({
              error: new Error("request unauthorized"),
            });
          }
          Sauce.deleteOne({ _id: req.params.id })
            .then(() =>
              res.status(200).json({ message: "object has been deleted" })
            )
            .catch((error) => res.status(404).json({ error }));
        });
      });
    })
    .catch((error) => res.status(500).json({ error }));
};

//================like sauce========================
exports.likeSauce = (req, res, next) => {
  //Current user
  const currentUser = req.body.userId;

  //User thumbs up(1) or down(-1)?
  const userThumb = req.body.like;
  //Get the sauce id in the req
  const currentSauceId = req.params.id;

  //====Check Opinions====

  //check if user already has an opinion
  function thumbs(sauce) {
    const likesUserList = sauce.usersLiked;
    const alreadyLiked = likesUserList.includes(currentUser);
    const dislikesUserList = sauce.usersDisliked;
    const alreadyDisliked = dislikesUserList.includes(currentUser);

    if (!alreadyLiked && !alreadyDisliked) {
      updateOpinions();
    } else if (alreadyLiked) {
      //check if user already liked and if so remove it
      removeLike();
    } else if (alreadyDisliked) {
      //check if user already disliked and if so remove it
      removeDisLike();
    }
  }

  //add and remove opinions functions
  function addLike() {
    Sauce.updateOne(
      { _id: currentSauceId },
      {
        $addToSet: { usersLiked: currentUser },
        $inc: { likes: userThumb },
      }
    )
      .then(() =>
        res.status(200).json({ message: "your bottle has been updated" })
      )
      .catch((error) =>
        res.status(403).json({
          error,
        })
      );
  }

  function removeLike() {
    Sauce.updateOne(
      { _id: currentSauceId },
      {
        $pull: { usersLiked: currentUser },
        $inc: { likes: -1 },
      }
    )
      .then(() =>
        res.status(200).json({ message: "your bottle has been updated" })
      )
      .catch((error) =>
        res.status(403).json({
          error,
        })
      );
  }

  function addDisLike() {
    Sauce.updateOne(
      { _id: currentSauceId },
      {
        $addToSet: { usersDisliked: currentUser },
        $inc: { dislikes: 1 },
      }
    )
      .then(() =>
        res.status(200).json({ message: "your bottle has been updated" })
      )
      .catch((error) =>
        res.status(403).json({
          error,
        })
      );
  }

  function removeDisLike() {
    Sauce.updateOne(
      { _id: currentSauceId },
      {
        $pull: { usersDisliked: currentUser },
        $inc: { dislikes: -1 },
      }
    )
      .then(() =>
        res.status(200).json({ message: "your bottle has been updated" })
      )
      .catch((error) =>
        res.status(403).json({
          error,
        })
      );
  }

  function updateOpinions() {
    if (userThumb === 1) {
      //add like
      addLike();
    } else if (userThumb === -1) {
      //add dislike
      addDisLike();
    }
  }

  //The sauce exist? then do things with it
  Sauce.findOne({ _id: currentSauceId })
    .then((sauce) => {
      thumbs(sauce);
    })
    .catch((error) =>
      res.status(404).json({
        error,
      })
    );
};
