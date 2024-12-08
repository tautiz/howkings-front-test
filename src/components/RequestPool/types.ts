export interface Tag {
  id: number;
  name: string;
  description: string;
  type: 'tag' | 'module_request';
}

export interface ModuleRequest {
  id: number;
  module_name: string;
  description: string;
  language: string;
  tags: Tag[];
  votes_count: number;
  created_at: string;
  updated_at: string;
}