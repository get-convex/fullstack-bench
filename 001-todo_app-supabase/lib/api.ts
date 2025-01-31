import { Database } from './database.types'
import { createClient } from './supabase'

type Tables = Database['public']['Tables']

export type Project = Tables['projects']['Row']
export type ProjectInsert = Tables['projects']['Insert']
export type ProjectMember = Tables['project_members']['Row']
export type Todo = Tables['todos']['Row']
export type TodoInsert = Tables['todos']['Insert']
export type TodoUpdate = Tables['todos']['Update']
export type Comment = Tables['comments']['Row']
export type CommentInsert = Tables['comments']['Insert']

// Projects
export async function getProjects() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createProject(project: ProjectInsert) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('projects')
    .insert(project)
    .select()
    .single()
  if (error) throw error

  // Add the creator as a member
  const { error: memberError } = await supabase
    .from('project_members')
    .insert({
      project_id: data.id,
      user_id: (await supabase.auth.getUser()).data.user!.id,
    })
  if (memberError) throw memberError

  return data
}

export async function updateProject(id: number, project: ProjectInsert) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('projects')
    .update(project)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteProject(id: number) {
  const supabase = createClient()
  const { error } = await supabase.from('projects').delete().eq('id', id)
  if (error) throw error
}

// Project Members
export async function getProjectMembers(projectId: number) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('project_members')
    .select('*, user:user_id(id, email)')
    .eq('project_id', projectId)
  if (error) throw error
  return data
}

export async function addProjectMember(projectId: number, userId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('project_members')
    .insert({ project_id: projectId, user_id: userId })
  if (error) throw error
}

export async function removeProjectMember(projectId: number, userId: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('project_members')
    .delete()
    .eq('project_id', projectId)
    .eq('user_id', userId)
  if (error) throw error
}

// Todos
export async function getTodos(projectId: number) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('todos')
    .select('*, assignee:assignee_id(id, email)')
    .eq('project_id', projectId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createTodo(todo: TodoInsert) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('todos')
    .insert(todo)
    .select('*, assignee:assignee_id(id, email)')
    .single()
  if (error) throw error
  return data
}

export async function updateTodo(id: number, todo: TodoUpdate) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('todos')
    .update(todo)
    .eq('id', id)
    .select('*, assignee:assignee_id(id, email)')
    .single()
  if (error) throw error
  return data
}

export async function deleteTodo(id: number) {
  const supabase = createClient()
  const { error } = await supabase.from('todos').delete().eq('id', id)
  if (error) throw error
}

// Comments
export async function getComments(todoId: number) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('comments')
    .select('*, author:author_id(id, email)')
    .eq('todo_id', todoId)
    .order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export async function createComment(comment: CommentInsert) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('comments')
    .insert(comment)
    .select('*, author:author_id(id, email)')
    .single()
  if (error) throw error
  return data
}

// Real-time subscriptions
export function subscribeToProject(
  projectId: number,
  callback: () => void
) {
  const supabase = createClient()
  return supabase
    .channel(`project:${projectId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'todos',
        filter: `project_id=eq.${projectId}`,
      },
      callback
    )
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'project_members',
        filter: `project_id=eq.${projectId}`,
      },
      callback
    )
    .subscribe()
}

export function subscribeToTodo(
  todoId: number,
  callback: () => void
) {
  const supabase = createClient()
  return supabase
    .channel(`todo:${todoId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'comments',
        filter: `todo_id=eq.${todoId}`,
      },
      callback
    )
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'todos',
        filter: `id=eq.${todoId}`,
      },
      callback
    )
    .subscribe()
}