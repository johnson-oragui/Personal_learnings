const deleteCookie = (res) => {
  try {
    const cookieName = 'refreshToken';
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'production',
      sameSite: 'None',
      maxAge: 0,
    };

    res.clearCookie(cookieName, cookieOptions);
  } catch (error) {
    console.error('Failed to delete cookie: ', error.message);
    throw new Error('Failed to delete cookie: ', error.message);
  }
};

module.exports = deleteCookie;
