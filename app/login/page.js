'use client';

import Styles from './Login.module.css'
import { Suspense } from 'react';
import Login from './login.jsx';

export default function loginSuspense() {
  return (
    <div className={Styles.Container}>
      <Suspense fallback={<div>Loading...</div>}>
        <Login />
      </Suspense>
    </div>
  )
}