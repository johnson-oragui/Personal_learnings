

export const GetTodo = async (req, res) => {
  // res.render('/views/layouts/todo');
  try {
    return res.send('first step to todo app');
  } catch (error) {
    console.error('error in GetTodo method', error.message);
  }
};

