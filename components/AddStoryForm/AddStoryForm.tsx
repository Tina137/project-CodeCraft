// "use client";

// import { useEffect, useState, useMemo, useRef } from "react";
// import { useRouter } from "next/navigation";
// import css from "./AddStoryForm.module.css";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";

// import { getCategories, createStory, updateStory } from "@/lib/api/clientApi";

// import { Category } from "@/types/category";
// import { StoryFormValues, StoryInitialData } from "@/types/story";
// import { Modal } from "@/components/Modal/Modal";

// interface Props {
//   initialData?: StoryInitialData;
//   isEdit?: boolean;
// }

// export default function AddStoryForm({ initialData, isEdit = false }: Props) {
//   const router = useRouter();

//   const [categories, setCategories] = useState<Category[]>([]);
//   const [preview, setPreview] = useState<string | null>(
//     initialData?.img ?? null
//   );
//   const [errorModal, setErrorModal] = useState(false);

//   const currentObjectUrlRef = useRef<string | null>(null);

//   useEffect(() => {
//     getCategories()
//       .then((data) => setCategories(data))
//       .catch((e) => {
//         console.error("Categories load error", e);
//       });
//   }, []);

//   const normalizedCategory = useMemo(() => {
//     if (!initialData) return "";
//     if (typeof initialData.category === "string") return initialData.category;
//     return (initialData.category as any)?._id ?? "";
//   }, [initialData]);

//   const validationSchema = Yup.object({
//     title: Yup.string()
//       .max(80, "Максимум 80 символів")
//       .required("Обов’язкове поле"),
//     article: Yup.string()
//       .max(2500, "Максимум 2500 символів")
//       .required("Обов’язкове поле"),
//     category: Yup.string().required("Обов’язкове поле"),
//     img: Yup.mixed()
//       .nullable()
//       .test("required-if-create", "Додайте фото", function (value) {
//         if (!isEdit && !value) return false;
//         return true;
//       })
//       .test("fileSize", "Максимальний розмір — 2MB", (file) => {
//         if (!file) return true;
//         if (!(file instanceof File)) return true;
//         return file.size <= 2 * 1024 * 1024;
//       }),
//   });

//   const initialValues: StoryFormValues = {
//     title: initialData?.title ?? "",
//     article: initialData?.article ?? "",
//     category: normalizedCategory,
//     img: null,
//   };

//   useEffect(() => {
//     return () => {
//       if (currentObjectUrlRef.current) {
//         URL.revokeObjectURL(currentObjectUrlRef.current);
//         currentObjectUrlRef.current = null;
//       }
//     };
//   }, []);

//   const handleSubmit = async (values: StoryFormValues) => {
//     try {
//       const payload: any = {
//         title: values.title,
//         article: values.article,
//         category: values.category,
//       };
//       if (values.img) payload.img = values.img;

//       if (isEdit && initialData?._id) {
//         const updated = await updateStory(initialData._id, payload);
//         router.push(`/stories/${updated._id}`);
//       } else {
//         const created = await createStory(payload);
//         router.push(`/stories/${created._id}`);
//       }
//     } catch (err) {
//       console.error(err);
//       setErrorModal(true);
//     }
//   };

//   return (
//     <>
//       {errorModal && (
//         <Modal onClose={() => setErrorModal(false)}>
//           <div className={css.modalContent}>
//             <h2 className={css.modalTitle}>Помилка збереження</h2>
//             <p className={css.modalText}>
//               Сталася помилка під час збереження історії. Спробуйте ще раз.
//             </p>
//             <button
//               onClick={() => setErrorModal(false)}
//               className={css.modalBtn}
//             >
//               Закрити
//             </button>
//           </div>
//         </Modal>
//       )}

//       <Formik
//         initialValues={initialValues}
//         onSubmit={handleSubmit}
//         validationSchema={validationSchema}
//         enableReinitialize
//       >
//         {({ setFieldValue, isValid }) => (
//           <Form className={css.form}>
//             <div className={css.content}>
//               <div className={css.left}>
//                 <h1 className={css.title}>
//                   {isEdit ? "Редагувати історію" : "Створити нову історію"}
//                 </h1>

//                 <label className={css.field}>
//                   <span className={css.labelText}>Обкладинка статті</span>

//                   <div className={css.previewBox}>
//                     {preview ? (
//                       <img
//                         src={preview}
//                         alt="preview"
//                         className={css.previewImg}
//                       />
//                     ) : (
//                       <div className={css.previewPlaceholder} />
//                     )}
//                   </div>

//                   <input
//                     type="file"
//                     accept="image/*"
//                     className={css.fileInput}
//                     onChange={(e) => {
//                       const file = e.currentTarget.files?.[0] ?? null;
//                       setFieldValue("img", file);

//                       if (currentObjectUrlRef.current) {
//                         URL.revokeObjectURL(currentObjectUrlRef.current);
//                         currentObjectUrlRef.current = null;
//                       }

//                       if (file) {
//                         const url = URL.createObjectURL(file);
//                         currentObjectUrlRef.current = url;
//                         setPreview(url);
//                       } else {
//                         setPreview(initialData?.img ?? null);
//                       }
//                     }}
//                   />

//                   <ErrorMessage
//                     name="img"
//                     component="div"
//                     className={css.error}
//                   />
//                 </label>

//                 <label className={css.field}>
//                   <span className={css.labelText}>Заголовок</span>
//                   <Field
//                     name="title"
//                     className={css.input}
//                     placeholder="Введіть заголовок"
//                   />
//                   <ErrorMessage
//                     name="title"
//                     component="div"
//                     className={css.error}
//                   />
//                 </label>

//                 <label className={css.field}>
//                   <span className={css.labelText}>Категорія</span>
//                   <Field as="select" name="category" className={css.select}>
//                     <option value="">Оберіть категорію</option>
//                     {categories.map((c) => (
//                       <option key={c._id} value={c._id}>
//                         {c.name}
//                       </option>
//                     ))}
//                   </Field>
//                   <ErrorMessage
//                     name="category"
//                     component="div"
//                     className={css.error}
//                   />
//                 </label>

//                 <label className={css.field}>
//                   <span className={css.labelText}>Текст історії</span>
//                   <Field
//                     as="textarea"
//                     name="article"
//                     className={css.textarea}
//                     placeholder="Розкажіть про свою подорож…"
//                   />
//                   <ErrorMessage
//                     name="article"
//                     component="div"
//                     className={css.error}
//                   />
//                 </label>
//               </div>

//               <div className={css.right}>
//                 <button
//                   type="submit"
//                   className={css.primaryBtn}
//                   disabled={!isValid}
//                 >
//                   Зберегти
//                 </button>

//                 <button
//                   type="button"
//                   className={css.secondaryBtn}
//                   onClick={() => router.push("/profile")}
//                 >
//                   Відмінити
//                 </button>
//               </div>
//             </div>
//           </Form>
//         )}
//       </Formik>
//     </>
//   );
// }

"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import css from "./AddStoryForm.module.css";

import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

import { getCategories, createStory, updateStory } from "@/lib/api/clientApi";
import { Category } from "@/types/category";
import { StoryFormValues, StoryInitialData } from "@/types/story";
import { Modal } from "@/components/Modal/Modal";

interface Props {
  initialData?: StoryInitialData;
  isEdit?: boolean;
}

export default function AddStoryForm({ initialData, isEdit = false }: Props) {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [preview, setPreview] = useState<string | null>(
    initialData?.img ?? null
  );
  const [errorModal, setErrorModal] = useState(false);

  const currentObjectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  const normalizedCategory = useMemo(() => {
    if (!initialData) return "";
    if (typeof initialData.category === "string") return initialData.category;
    return (initialData.category as any)?._id ?? "";
  }, [initialData]);

  const validationSchema = Yup.object({
    title: Yup.string().max(80).required("Обов’язкове поле"),
    article: Yup.string().max(2500).required("Обов’язкове поле"),
    category: Yup.string().required("Обов’язкове поле"),
    img: Yup.mixed()
      .nullable()
      .test("required-if-create", "Додайте фото", function (value) {
        if (!isEdit && !value) return false;
        return true;
      }),
  });

  const initialValues: StoryFormValues = {
    title: initialData?.title ?? "",
    article: initialData?.article ?? "",
    category: normalizedCategory,
    img: null,
  };

  useEffect(() => {
    return () => {
      if (currentObjectUrlRef.current) {
        URL.revokeObjectURL(currentObjectUrlRef.current);
      }
    };
  }, []);

  const handleSubmit = async (values: StoryFormValues) => {
    try {
      const payload: any = {
        title: values.title,
        article: values.article,
        category: values.category,
      };
      if (values.img) payload.img = values.img;

      if (isEdit && initialData?._id) {
        const updated = await updateStory(initialData._id, payload);
        router.push(`/stories/${updated._id}`);
      } else {
        const created = await createStory(payload);
        router.push(`/stories/${created._id}`);
      }
    } catch (err) {
      setErrorModal(true);
    }
  };

  return (
    <>
      {errorModal && (
        <Modal onClose={() => setErrorModal(false)}>
          <div className={css.modalContent}>
            <h2 className={css.modalTitle}>Помилка збереження</h2>
            <p className={css.modalText}>
              Сталася помилка під час збереження історії. Спробуйте ще раз.
            </p>
            <button
              onClick={() => setErrorModal(false)}
              className={css.modalBtn}
            >
              Закрити
            </button>
          </div>
        </Modal>
      )}

      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validationSchema}
        enableReinitialize
        validateOnMount
      >
        {({ setFieldValue, isValid, dirty }) => (
          <Form className={css.formWrapper}>
            <h1 className={css.title}>
              {isEdit ? "Редагувати історію" : "Створити нову історію"}
            </h1>

            <div className={css.grid}>
              {/* LEFT */}
              <div className={css.left}>
                <label className={css.label}>
                  <span className={css.labelText}>Обкладинка статті</span>

                  <div className={css.previewBox}>
                    {preview ? (
                      <img
                        src={preview}
                        alt="preview"
                        className={css.previewImg}
                      />
                    ) : (
                      <div className={css.placeholder}>
                        <img
                          src="/Placeholder_Image.png"
                          alt="placeholder"
                          className={css.placeholderIcon}
                        />
                      </div>
                    )}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    id="upload"
                    className={css.hiddenInput}
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setFieldValue("img", file);

                      if (currentObjectUrlRef.current) {
                        URL.revokeObjectURL(currentObjectUrlRef.current);
                      }

                      if (file) {
                        const url = URL.createObjectURL(file);
                        currentObjectUrlRef.current = url;
                        setPreview(url);
                      } else {
                        setPreview(initialData?.img ?? null);
                      }
                    }}
                  />

                  <label htmlFor="upload" className={css.uploadBtn}>
                    Завантажити фото
                  </label>

                  <ErrorMessage
                    name="img"
                    component="div"
                    className={css.error}
                  />
                </label>

                <label className={css.label}>
                  <span className={css.labelText}>Заголовок</span>
                  <Field
                    name="title"
                    className={css.input}
                    placeholder="Введіть заголовок історії"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className={css.error}
                  />
                </label>

                <label className={css.label}>
                  <span className={css.labelText}>Категорія</span>
                  <Field as="select" name="category" className={css.select}>
                    <option value="">Категорія</option>
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage
                    name="category"
                    component="div"
                    className={css.error}
                  />
                </label>

                <label className={css.label}>
                  <span className={css.labelText}>Текст історії</span>
                  <Field
                    as="textarea"
                    name="article"
                    className={css.textarea}
                    placeholder="Ваша історія тут"
                  />
                  <ErrorMessage
                    name="article"
                    component="div"
                    className={css.error}
                  />
                </label>
              </div>

              {/* RIGHT */}
              <div className={css.right}>
                <button
                  type="submit"
                  className={css.saveBtn}
                  disabled={!isValid || !dirty}
                >
                  Зберегти
                </button>

                <button
                  type="button"
                  className={css.cancelBtn}
                  onClick={() => router.push("/profile")}
                >
                  Відмінити
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}
