const setCookie = (res, refreshToken) => {
  try {
    const cookieName = 'refreshToken';
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'production',
      sameSite: 'Strict',
      maxAge: 24 * 1000 * 60 * 60,
    };

    res.cookie(cookieName, refreshToken, cookieOptions);
  } catch (error) {
    console.error('Failed to set Cookie: ', error.message);
    throw new Error('Failed to set Cookie: ', error.message);
  }
};

module.exports = setCookie;
