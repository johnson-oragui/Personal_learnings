

export const GetTodo = async (req, res) => {
  try {
    res.locals.titleValue = 'Todo';
    res.locals.descriptionValue = 'Home page for Todo';
    return res.render('index');;
  } catch (error) {
    console.error('error in GetTodo method', error.message);
  }
};

