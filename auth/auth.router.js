import { Router } from 'express';
import { googleAuth, googleRedirect } from '../auth/auth.controller.js';
import { catchAsync } from '../helpers/catchAsync.js';

const router = Router();

router.get('/google', catchAsync(googleAuth));

router.get('/google-redirect', catchAsync(googleRedirect));

export default router;
