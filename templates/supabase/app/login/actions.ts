'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { serverClient } from "@/lib/serverClient"

export async function login(formData: FormData) {
  const supabase = await serverClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    console.log("error", error);
    redirect('/login/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await serverClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.log("error", error);
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}