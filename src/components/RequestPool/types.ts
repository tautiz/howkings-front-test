export interface Tag {
  id: number;
  name: string;
  parent_tag_id: number | null;
  slug: string;
  type: 'module_request' | 'tag';
  order_column: number;
  color: string;
  icon: string;
  status_id: number;
  description: string;
}

export interface ModuleRequest {
  id: number;
  module_name: string;
  description: string;
  status_id: number;
  language: string;
  type: 'student' | 'teacher';
  modules_requests_id: number | null;
  votes_count: number;
  tags: Tag[];
}