'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState, useEffect } from 'react';
import { type TRecipe } from '@/lib/types';

export default function New() {
  const Router = useRouter();

  const [title, setTitle] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [steps, setSteps] = useState<string[]>([]);
  const [recipes, setRecipes] = useState<TRecipe[]>([]);

  const tagRef = useRef<HTMLInputElement>(null);
  const ingredientRef = useRef<HTMLInputElement>(null);
  const stepRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const storedRecipes = localStorage.getItem('recipes');
    const existingRecipes = storedRecipes ? JSON.parse(storedRecipes) : [];
    setRecipes(existingRecipes);
  }, []);

  const handleAddTag = () => {
    if (tagRef.current) {
      const newTag = tagRef.current.value.trim();
      if (newTag) {
        setTags((prevTags) => [...prevTags, `#${newTag}`]);
        tagRef.current.value = '';
      }
    }
  };
  const handleRemoveTag = (index: number) => {
    setTags((prevTags) => prevTags.filter((_, i) => i !== index));
  };

  const handleAddIngredient = () => {
    if (ingredientRef.current) {
      const newIngredient = ingredientRef.current.value.trim();
      if (newIngredient) {
        setIngredients((prevIngredients) => [
          ...prevIngredients,
          newIngredient,
        ]);
        ingredientRef.current.value = '';
      }
    }
  };
  const handleRemoveIngredient = (index: number) => {
    setIngredients((prevIngredients) =>
      prevIngredients.filter((_, i) => i !== index)
    );
  };

  const handleAddStep = () => {
    if (stepRef.current) {
      const newStep = stepRef.current.value.trim();
      if (newStep) {
        setSteps((prevSteps) => [...prevSteps, newStep]);
        stepRef.current.value = '';
      }
    }
  };
  const handleRemoveStep = (index: number) => {
    setSteps((prevSteps) => prevSteps.filter((_, i) => i !== index));
  };

  const isSaveDisabled = !title;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSaveDisabled) return alert('레시피 제목을 추가하세요');

    const recipeId = recipes.length
      ? Math.max(...recipes.map((r) => r.id)) + 1
      : 1;

    const newRecipe: TRecipe = {
      id: recipeId,
      title,
      tags,
      ingredients,
      steps,
      versions: [
        {
          date: new Date().toISOString(),
          recipe: {
            id: recipeId,
            title,
            tags,
            ingredients,
            steps,
            versions: [],
          },
        },
      ],
    };

    const updatedRecipes = [...recipes, newRecipe];
    localStorage.setItem('recipes', JSON.stringify(updatedRecipes));
    setRecipes(updatedRecipes);

    Router.push('/recipes');
  };

  return (
    <div className='w-full'>
      <h1 className='text-3xl font-extrabold my-4'>새 레시피 추가하기</h1>

      <div className='space-y-5'>
        <div className='flex flex-col space-y-3'>
          <label htmlFor='title' className='font-bold text-xl'>
            레시피 제목
          </label>
          <input
            name='title'
            type='text'
            placeholder='레시피 제목을 입력하세요.'
            onChange={(e) => setTitle(e.target.value)}
            className='border text-black p-2 rounded'
          />
        </div>

        {/* 태그 */}
        <form
          className='flex flex-col space-y-3'
          onSubmit={(e) => {
            e.preventDefault();
            handleAddTag();
          }}
        >
          <label htmlFor='tag' className='font-bold text-xl'>
            태그
          </label>
          <div className='flex justify-between gap-3'>
            <input
              name='tag'
              ref={tagRef}
              type='text'
              placeholder='태그를 입력하세요.'
              className='w-[94%] border text-black p-2 rounded'
            />
            <button
              type='submit'
              className='btn-default bg-purple-300 text-black hover:bg-purple-500'
            >
              추가
            </button>
          </div>
          <div className='flex'>
            {tags.map((tag, index) => (
              <div key={index} className='flex'>
                <div className='btn-small bg-gray-300 mr-2 text-gray-800'>
                  <span>{tag}</span>
                  <button
                    onClick={() => handleRemoveTag(index)}
                    className='text-red-500 ml-2'
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>
        </form>

        {/* 재료 목록 */}
        <form
          className='flex flex-col space-y-3'
          onSubmit={(e) => {
            e.preventDefault();
            handleAddIngredient();
          }}
        >
          <label htmlFor='ingredient' className='font-bold text-xl'>
            재료 목록
          </label>
          <div className='flex justify-between gap-3'>
            <input
              name='ingredient'
              ref={ingredientRef}
              type='text'
              placeholder='재료를 입력하세요.'
              className='w-[94%] border text-black p-2 rounded'
            />
            <button
              type='submit'
              className='bg-green-300 text-black px-3 py-2 rounded hover:bg-green-500'
            >
              추가
            </button>
          </div>
          <div className='ml-5'>
            {ingredients.map((ingredient, index) => (
              <div key={index} className='flex gap-3'>
                <li>{ingredient}</li>
                <button
                  onClick={() => handleRemoveIngredient(index)}
                  className='text-red-500'
                >
                  삭제
                </button>
              </div>
            ))}
          </div>
        </form>

        {/* 조리 과정 */}
        <form
          className='flex flex-col space-y-3'
          onSubmit={(e) => {
            e.preventDefault();
            handleAddStep();
          }}
        >
          <label htmlFor='step' className='font-bold text-xl'>
            조리 과정
          </label>
          <div className='flex justify-between gap-3'>
            <input
              name='step'
              ref={stepRef}
              type='text'
              placeholder='조리 과정을 입력하세요.'
              className='w-[94%] border text-black p-2 rounded'
            />
            <button
              type='submit'
              className='btn-default bg-green-300 text-black hover:bg-green-500'
            >
              추가
            </button>
          </div>

          <ol className='list-decimal ml-5'>
            {steps.map((step, index) => (
              <div key={index} className='flex gap-3'>
                <li>{step}</li>
                <button
                  onClick={() => handleRemoveStep(index)}
                  className='text-red-500'
                >
                  삭제
                </button>
              </div>
            ))}
          </ol>
        </form>

        <div>
          <button
            type='submit'
            onClick={handleSubmit}
            className={`btn-default bg-blue-600 text-white ${isSaveDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            레시피 저장
          </button>
        </div>
      </div>
    </div>
  );
}
