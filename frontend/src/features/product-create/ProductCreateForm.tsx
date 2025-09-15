import { useState } from "react";
import {
  Modal,
  Form,
  Button,
  Alert,
  Spinner,
  Row,
  Col,
  Card,
  Image,
} from "react-bootstrap";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import productsServices from "../../entities/Products/api/productsServices";
import axios from "axios";

// Типы для входных данных формы
type ProductFormInput = {
  name: string;
  description: string;
  price: string | number;
  discountPrice: string | number | null;
  article: string;
  image?: string | File | null | undefined;
};

// Типы для выходных данных после трансформации Zod
type ProductFormOutput = {
  name: string;
  description: string;
  price: number;
  discountPrice: number | null;
  article: string;
  image?: string | File | null | undefined;
};

// Схема валидации с Zod
const productSchema = z
  .object({
    name: z
      .string()
      .min(2, "Минимум 2 символа")
      .nonempty("Название обязательно"),
    description: z
      .string()
      .min(10, "Минимум 10 символов")
      .nonempty("Описание обязательно"),
    price: z
      .union([z.number(), z.string()])
      .transform((val) =>
        typeof val === "string" ? parseFloat(val) || 0 : val
      )
      .pipe(
        z
          .number()
          .positive("Цена должна быть положительной")
          .min(0.01, "Цена обязательна")
      ),
    discountPrice: z
      .union([z.number(), z.string(), z.null()])
      .transform((val) => {
        if (val === null || val === undefined || val === "") return null;
        return typeof val === "string" ? parseFloat(val) || 0 : val;
      })
      .pipe(z.number().min(0, "Скидка не может быть отрицательной").nullable()),
    article: z
      .string()
      .min(3, "Минимум 3 символа")
      .nonempty("Артикул обязателен"),
    image: z
      .instanceof(File)
      .optional()
      .nullable()
      .or(z.string().optional().nullable()),
  })
  .refine(
    (data) =>
      data.discountPrice === null ||
      data.discountPrice === undefined ||
      data.discountPrice < data.price,
    {
      message: "Цена со скидкой должна быть меньше обычной цены",
      path: ["discountPrice"],
    }
  );

interface ProductCreateFormProps {
  show: boolean;
  onHide: () => void;
  onSuccess: () => void;
}

export const ProductCreateForm = ({
  show,
  onHide,
  onSuccess,
}: ProductCreateFormProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ProductFormInput, unknown, ProductFormOutput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      discountPrice: null,
      article: "",
      image: undefined,
    },
  });

  const watchedPrice = watch("price");
  const watchedDiscountPrice = watch("discountPrice");

  const handleClose = () => {
    reset({
      name: "",
      description: "",
      price: "",
      discountPrice: null,
      article: "",
      image: undefined,
    });
    setImagePreview(null);
    setError(null);
    onHide();
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("image", file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setValue("image", null);
      setImagePreview(null);
    }
  };

  const removeImage = () => {
    setValue("image", null);
    setImagePreview(null);
  };

  const onSubmit = async (data: ProductFormOutput) => {
    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price.toString());
      formData.append("article", data.article);

      if (data.discountPrice) {
        formData.append("discountPrice", data.discountPrice.toString());
      } else {
        formData.append("discountPrice", "");
      }

      if (data.image instanceof File) {
        formData.append("image", data.image);
      }

      await productsServices.createProduct(formData);
      onSuccess();
      handleClose();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Ошибка при создании товара");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Добавить новый товар</Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Название товара *</Form.Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      isInvalid={!!errors.name}
                      placeholder="Введите название товара"
                    />
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Артикул *</Form.Label>
                <Controller
                  name="article"
                  control={control}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      isInvalid={!!errors.article}
                      placeholder="Введите артикул"
                    />
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.article?.message}
                </Form.Control.Feedback>
              </Form.Group>

              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Цена ($) *</Form.Label>
                    <Controller
                      name="price"
                      control={control}
                      render={({ field }) => (
                        <Form.Control
                          {...field}
                          type="number"
                          step="0.01"
                          min="0"
                          isInvalid={!!errors.price}
                          placeholder="0.00"
                        />
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.price?.message}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>Цена со скидкой ($)</Form.Label>
                    <Controller
                      name="discountPrice"
                      control={control}
                      render={({ field }) => (
                        <Form.Control
                          {...field}
                          type="number"
                          step="0.01"
                          min="0"
                          isInvalid={!!errors.discountPrice}
                          placeholder="0.00"
                          value={field.value === null ? "" : field.value}
                        />
                      )}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.discountPrice?.message}
                    </Form.Control.Feedback>
                    {watchedDiscountPrice &&
                      watchedPrice &&
                      watchedDiscountPrice >= watchedPrice && (
                        <Form.Text className="text-danger">
                          Цена со скидкой должна быть меньше обычной цены
                        </Form.Text>
                      )}
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Изображение товара</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
                <Form.Text className="text-muted">
                  Загрузите изображение товара
                </Form.Text>
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Описание *</Form.Label>
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <Form.Control
                      {...field}
                      as="textarea"
                      rows={5}
                      isInvalid={!!errors.description}
                      placeholder="Введите описание товара"
                    />
                  )}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.description?.message}
                </Form.Control.Feedback>
              </Form.Group>

              {imagePreview && (
                <Card className="mb-3">
                  <Card.Header>
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Предпросмотр изображения</span>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={removeImage}
                      >
                        Удалить
                      </Button>
                    </div>
                  </Card.Header>
                  <Card.Body className="text-center">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fluid
                      style={{ maxHeight: "200px", objectFit: "contain" }}
                    />
                  </Card.Body>
                </Card>
              )}
            </Col>
          </Row>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Отмена
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Создание...
              </>
            ) : (
              "Создать товар"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
