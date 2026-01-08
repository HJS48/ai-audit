export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      audit_submissions: {
        Row: {
          id: string
          created_at: string
          data: Json
        }
        Insert: {
          id?: string
          created_at?: string
          data: Json
        }
        Update: {
          id?: string
          created_at?: string
          data?: Json
        }
      }
      kg_nodes: {
        Row: {
          id: string
          type: string
          name: string
          properties: Json
        }
        Insert: {
          id?: string
          type: string
          name: string
          properties?: Json
        }
        Update: {
          id?: string
          type?: string
          name?: string
          properties?: Json
        }
      }
      kg_edges: {
        Row: {
          id: string
          from_node: string
          to_node: string
          relationship: string
          properties: Json
        }
        Insert: {
          id?: string
          from_node: string
          to_node: string
          relationship: string
          properties?: Json
        }
        Update: {
          id?: string
          from_node?: string
          to_node?: string
          relationship?: string
          properties?: Json
        }
      }
      roi_assumptions: {
        Row: {
          id: string
          key: string
          value: number
          min_value: number | null
          max_value: number | null
          description: string | null
        }
        Insert: {
          id?: string
          key: string
          value: number
          min_value?: number | null
          max_value?: number | null
          description?: string | null
        }
        Update: {
          id?: string
          key?: string
          value?: number
          min_value?: number | null
          max_value?: number | null
          description?: string | null
        }
      }
      task_compressions: {
        Row: {
          id: string
          automation: string
          task_name: string
          department: string
          before_mins: number
          after_mins: number
        }
        Insert: {
          id?: string
          automation: string
          task_name: string
          department: string
          before_mins: number
          after_mins: number
        }
        Update: {
          id?: string
          automation?: string
          task_name?: string
          department?: string
          before_mins?: number
          after_mins?: number
        }
      }
    }
    Views: {
      submission_data_maturity: {
        Row: {
          submission_id: string
          data_source: string
          capture_score: number
          connect_score: number
          access_score: number
          maturity_score: number
        }
      }
      submission_roi: {
        Row: {
          submission_id: string
          headcount: number
          avg_salary: number
          hourly_rate: number
          num_clients: number
          avg_client_value: number
          deals_per_year: number
          projects_per_year: number
          churn_rate: number
          cost_per_revision: number
          pain_time_bleeding: number
          pain_knowledge_loss: number
          pain_churn: number
          pain_deals: number
          pain_rework: number
          primary_focus: string
          department_weightings: Json
        }
      }
      submission_full_roi: {
        Row: {
          submission_id: string
          headcount: number
          avg_salary: number
          hourly_rate: number
          num_clients: number
          avg_client_value: number
          time_bleeding_annual: number
          churn_annual: number
          missed_deals_annual: number
          rework_annual: number
          total_annual_cost: number
        }
      }
      submission_gaps: {
        Row: {
          submission_id: string
          info_type: string
          from_dept: string
          data_source: string
          maturity_score: number
          status: string
          mins_per_week: number
          cost_multiplier: number
        }
      }
      submission_automation_roi: {
        Row: {
          submission_id: string
          automation: string
          fix_type: string
          info_types_fixable: number
          total_mins_per_week: number
          hours_per_week: number
          fte_equivalent: number
          annual_value: number
        }
      }
      submission_task_compressions: {
        Row: {
          submission_id: string
          automation: string
          task_name: string
          department: string
          before_mins: number
          after_mins: number
          reduction_pct: number
        }
      }
    }
    Functions: {}
    Enums: {}
  }
}

// Helper types for views
export type SubmissionFullROI = Database['public']['Views']['submission_full_roi']['Row']
export type SubmissionDataMaturity = Database['public']['Views']['submission_data_maturity']['Row']
export type SubmissionGap = Database['public']['Views']['submission_gaps']['Row']
export type SubmissionAutomationROI = Database['public']['Views']['submission_automation_roi']['Row']
export type SubmissionTaskCompression = Database['public']['Views']['submission_task_compressions']['Row']
