const router = require("express").Router();
const { Category, Product, Tag, ProductTag } = require("../../models");

// The `/api/categories` endpoint

router.get("/", async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const cateData = await Category.findAll(req.body, {
      include: [Product],
    });
    res.status(200).json(cateData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const cateData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!cateData) {
      res.status(404).json({ message: "No Category found with this id!" });
      return;
    }

    res.status(200).json(cateData);
  } catch (err) {
    res.status(500).json(err);
  }
  const category = cateData.get({ plain: true });
  res.render("category", category);
});

router.post("/", async (req, res) => {
  // create a new category
  Category.create({
    category_name: req.body.category_name,
  })
    .then((product) => res.join(product))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put("/:id", async (req, res) => {
  // update a category by its `id` value
  Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((category) => {
      if (!category[0]) {
        res.status(404).json({ message: "No Category found with this id" });
        return;
      }
      res.json(category);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.delete("/:id", async (req, res) => {
  // delete a category by its `id` value
  try {
    const deleteCat = await Category.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!deleteCat) {
      res.status(404).json({ message: "No Category found with this id!" });
      return;
    }

    res.status(200).json(deleteCat);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
