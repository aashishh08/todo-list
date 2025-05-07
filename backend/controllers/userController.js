const { User, Todo, Note } = require("../models");
const { Op } = require("sequelize");

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "email"],
    });
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: ["id", "username", "email"],
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

exports.getUserTodos = async (req, res) => {
  try {
    const { userId } = req.params;

    // Pagination parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Sorting parameters
    const sortBy = req.query.sortBy || "createdAt";
    const sortOrder =
      req.query.sortOrder?.toUpperCase() === "DESC" ? "DESC" : "ASC";

    // Filter parameters
    const where = { userId };
    if (req.query.status) where.completed = req.query.status === "completed";
    if (req.query.priority) {
      const priorities = req.query.priority.split(",");
      console.log("Priority query parameter:", priorities);
      where.priority = {
        [Op.in]: priorities,
      };
    }
    if (req.query.tags) {
      where.tags = {
        [Op.contains]: [req.query.tags],
      };
    }
    if (req.query.search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${req.query.search}%` } },
        { description: { [Op.iLike]: `%${req.query.search}%` } },
      ];
    }

    console.log("Where: ", where);

    // Get total count for pagination
    const total = await Todo.count({ where });

    // Get todos with pagination, sorting, and filtering
    const todos = await Todo.findAll({
      where,
      include: [
        {
          model: User,
          attributes: ["id", "username", "email"],
        },
        {
          model: Note,
          attributes: ["id", "content", "createdAt"],
          order: [["createdAt", "DESC"]],
        },
      ],
      order: [[sortBy, sortOrder]],
      limit,
      offset,
    });

    res.json({
      todos,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching user todos:", error);
    res.status(500).json({ error: "Failed to fetch user todos" });
  }
};
