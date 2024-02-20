import todoModel from '../models/todo';

export const GetTodo = async (req, res) => {
  try {
    res.locals.titleValue = 'Todo';
    res.locals.descriptionValue = 'Home page for Todo';

    res.locals.todoTitleValue = '';
    res.locals.todoContentValue = '';

    const todos = await todoModel.find();

    return res.render('index', { todos });;
  } catch (error) {
    return res.redirect('/'); 
  }
};

export const AddTodo = async (req, res) => {
  try {
    res.locals.titleValue = 'Todo';
    res.locals.descriptionValue = 'Page for Adding Todo';

    res.locals.todoTitleValue = '';
    res.locals.todoContentValue = '';
    return res.render('addTodo');
  } catch (error) {
    return res.redirect('/add');
  }
};

export const PostAddTodo = async (req, res) => {
  try {
    res.locals.titleValue = 'Todo';
    res.locals.descriptionValue = 'Add Todo';

    const { title, content } = req.body;

    if (title === null || title === undefined || title.trim() === '') {
      res.locals.todoTitleValue = '';
      res.locals.todoContentValue = content;
      return res.render('addTodo');
    }

    if (content === null || content === undefined || content.trim() === '') {
      res.locals.todoContentValue = '';
      return res.render('addTodo', {
        todoTitleValue: title,
        todoContentValue: '',
      });
    }
    const todoToAdd = {
      title,
      content,
    };

    const newTodo = new todoModel(todoToAdd);

    await todoModel.create(newTodo);
    const todos = await todoModel.find();
    return res.render('index', { todos });
  } catch (error) {
    return res.render('index', { todos });
  }
};

export const DeleteTodo = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.redirect('/');
  }
  try {
    const todoToDelete = await todoModel.findOneAndDelete({ _id: id });
    res.redirect('/');
  } catch (error) {
    console.error(error);
    return res.redirect('/');
  }
};
