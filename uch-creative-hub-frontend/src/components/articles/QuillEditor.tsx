"use client";

import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface QuillEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}

export interface QuillEditorRef {
  getContent: () => string;
  setContent: (content: string) => void;
  focus: () => void;
}

const QuillEditor = forwardRef<QuillEditorRef, QuillEditorProps>(
  ({ value = '', onChange, placeholder = 'Tulis artikel Anda...', readOnly = false, className = '' }, ref) => {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);

    useImperativeHandle(ref, () => ({
      getContent: () => {
        return quillRef.current?.root.innerHTML || '';
      },
      setContent: (content: string) => {
        if (quillRef.current) {
          const currentSelection = quillRef.current.getSelection();
          quillRef.current.root.innerHTML = content;
          // Restore selection if it existed
          if (currentSelection) {
            quillRef.current.setSelection(currentSelection);
          }
        }
      },
      focus: () => {
        quillRef.current?.focus();
      },
    }));

    useEffect(() => {
      if (!editorRef.current) return;

      // Prevent double initialization
      if (quillRef.current) {
        return;
      }

      // Konfigurasi toolbar Quill
      const toolbarOptions = [
        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
        [{ 'font': [] }],
        [{ 'size': ['small', false, 'large', 'huge'] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'color': [] }, { 'background': [] }],
        [{ 'script': 'sub'}, { 'script': 'super' }],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }],
        [{ 'direction': 'rtl' }],
        [{ 'align': [] }],
        ['blockquote', 'code-block'],
        ['link', 'image', 'video'],
        ['clean']
      ];

      // Initialize Quill
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
        readOnly,
        placeholder,
        modules: {
          toolbar: readOnly ? false : toolbarOptions,
        },
      });

      // Set initial content
      if (value) {
        quillRef.current.root.innerHTML = value;
      }

      // Listen for text changes
      const handleTextChange = () => {
        if (quillRef.current && onChange) {
          const content = quillRef.current.root.innerHTML;
          onChange(content);
        }
      };

      quillRef.current.on('text-change', handleTextChange);

      // Cleanup function
      return () => {
        if (quillRef.current) {
          quillRef.current.off('text-change', handleTextChange);
          // Don't set quillRef.current to null here to prevent re-initialization
        }
      };
    }, []); // Remove dependencies to prevent re-initialization

    // Handle changes to readOnly prop
    useEffect(() => {
      if (quillRef.current) {
        quillRef.current.enable(!readOnly);
      }
    }, [readOnly]);

    // Update content when value prop changes
    useEffect(() => {
      if (quillRef.current && value !== quillRef.current.root.innerHTML) {
        const currentSelection = quillRef.current.getSelection();
        quillRef.current.root.innerHTML = value;
        // Restore selection if it existed
        if (currentSelection) {
          quillRef.current.setSelection(currentSelection);
        }
      }
    }, [value]);

    return (
      <div className={`quill-editor ${className}`}>
        <div ref={editorRef} />
        <style jsx global>{`
          .quill-editor .ql-editor {
            min-height: 200px;
            font-size: 16px;
            line-height: 1.6;
          }
          
          .quill-editor .ql-toolbar {
            border-top: 1px solid #ccc;
            border-left: 1px solid #ccc;
            border-right: 1px solid #ccc;
            border-radius: 8px 8px 0 0;
          }
          
          .quill-editor .ql-container {
            border-bottom: 1px solid #ccc;
            border-left: 1px solid #ccc;
            border-right: 1px solid #ccc;
            border-radius: 0 0 8px 8px;
          }
          
          .quill-editor .ql-editor.ql-blank::before {
            font-style: normal;
            color: #9ca3af;
          }
          
          .quill-editor .ql-editor:focus {
            outline: none;
          }
        `}</style>
      </div>
    );
  }
);

QuillEditor.displayName = 'QuillEditor';

export default QuillEditor;
