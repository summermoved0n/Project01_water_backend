import { Router } from 'express';
import { googleAuth, googleRedirect } from '../auth.controller/auth.controller';
import { catchAsync } from '../helpers/catchAsync';

const router = Router();

router.get('/google', catchAsync(googleAuth));

router.get('/google-redirect', catchAsync(googleRedirect));

export default router;
