class ViewsController {
  static getHome(req, res) {
    const message = {
      'No authentication endpoints': {
        '/api/todo/': 'API documentations',
        '/api/todo/register': 'Register a new user.',
        '/api/todo/login': 'Login existing user.',
      },
      'Authentication Endpoints': {
        '/api/todo/logout': 'Logout user.',
      },
      'Todo List Endpoints': {
        '/api/todo': {
          GET: 'Get all todos for the authenticated user.',
          POST: 'Create a new todo.',
        },
        '/api/todo/:id': {
          GET: 'Get a specific todo by ID.',
          PUT: 'Update an existing todo by ID.',
          DELETE: 'Delete a todo by ID.',
        },
      },
      'User Profile Endpoints': {
        '/api/todo/profile': {
          GET: 'Get the profile details of the authenticated user.',
          PUT: 'Update the profile details of the authenticated user.',
        },
        '/api/todo/profile/password': {
          PUT: 'Update the password of the authenticated user.',
        },
        '/api/todo/profile/avatar': {
          PUT: 'Update the avatar of the authenticated user.',
        },
      },
    };
    return res.status(200).json({ message });
  }
}

module.exports = ViewsController;
