<?php
// app/Http/Requests/Admin/UpdateCourseRequest.php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCourseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $courseId = $this->route('course') ? $this->route('course')->id : null;

        return [
            'title' => [
                'required',
                'string',
                'max:255',
                Rule::unique('courses', 'title')->ignore($courseId)
            ],
            'slug' => [
                'nullable',
                'string',
                'max:255',
                Rule::unique('courses', 'slug')->ignore($courseId)
            ],
            'short_description' => 'required|string|max:500',
            'description' => 'required|string',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'category_id' => 'required|exists:categories,id',
            
            // ✅ trainer_id ET trainer_name optionnels
            'trainer_id' => 'nullable|exists:trainers,id',
            'trainer_name' => 'required_without:trainer_id|string|max:255',
            
            'type' => 'required|in:formation,certification,specialisation',
            'level' => 'required|in:debutant,intermediaire,avance',
            'difficulty' => 'required|in:facile,modere,difficile',
            'price' => 'required|numeric|min:0',
            'original_price' => 'nullable|numeric|min:0|gt:price',
            'duration_hours' => 'required|integer|min:1',
            
            'access_link' => 'nullable|url|max:500',
            'video_url' => 'nullable|url|max:500',
            
            'skills' => 'nullable|string',
            'is_trending' => 'boolean',
            'is_bestseller' => 'boolean',
            'is_new' => 'boolean',
            'is_active' => 'boolean',
            'published_at' => 'nullable|date',
        ];
    }

    protected function prepareForValidation()
    {
        if ($this->skills && is_string($this->skills)) {
            try {
                $decoded = json_decode($this->skills, true);
                $this->merge(['skills' => $decoded ?? []]);
            } catch (\Exception $e) {
                $this->merge(['skills' => []]);
            }
        }

        $this->merge([
            'is_trending' => filter_var($this->is_trending ?? false, FILTER_VALIDATE_BOOLEAN),
            'is_bestseller' => filter_var($this->is_bestseller ?? false, FILTER_VALIDATE_BOOLEAN),
            'is_new' => filter_var($this->is_new ?? false, FILTER_VALIDATE_BOOLEAN),
            'is_active' => filter_var($this->is_active ?? true, FILTER_VALIDATE_BOOLEAN),
        ]);
    }
}