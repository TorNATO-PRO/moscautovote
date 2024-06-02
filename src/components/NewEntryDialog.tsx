import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";

type NewEntryDialogProps = Readonly<{
  onCreate: (entry: VoteEntry) => void,
  onClose: () => void,
}>;

const schema = z.object({
  owner: z.string().min(1, "Owner is required"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.string().refine(val => !isNaN(parseInt(val)), {
    message: "Year must be a number"
  }),
  category: z.string(),
  votes: z.string().refine(val => !isNaN(parseInt(val)), {
    message: "Votes must be a number"
  }),
});

function NewEntryDialog(props: NewEntryDialogProps): React.ReactElement {
  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      owner: "",
      make: "",
      model: "",
      category: "",
    },
  });

  const onSubmit = (data: FormData) => {
    props.onCreate({
      owner: data.owner,
      make: data.make,
      model: data.model,
      year: parseInt(data.year),
      category: data.category,
      votes: parseInt(data.votes),
    });
    props.onClose();
  } 

  return (
    <Dialog open={true} onClose={props.onClose}>
      <DialogTitle>New Entry</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter the following information to create a
          new entry.
        </DialogContentText>
        <TextField
          autoFocus
          required
          margin="normal"
          id="owner"
          label="Owner"
          type="text"
          fullWidth
          {...register("owner")}
          error={!!errors.owner && touchedFields.owner}
          helperText={errors.owner?.message}
        />
        <TextField
          required
          margin="normal"
          id="year"
          label="Year"
          type="text"
          fullWidth
          {...register("year")}
          error={!!errors.year && touchedFields.year}
          helperText={errors.year?.message}
        />
        <TextField
          required
          margin="normal"
          id="make"
          label="Make"
          type="text"
          fullWidth
          {...register("make")}
          error={!!errors.make && touchedFields.make}
          helperText={errors.make?.message}
        />
        <TextField
          required
          margin="normal"
          id="model"
          label="Model"
          type="text"
          fullWidth
          {...register("model")}
          error={!!errors.model && touchedFields.model}
          helperText={errors.model?.message}
        />
        <TextField
          required
          margin="normal"
          id="category"
          label="Category"
          type="text"
          fullWidth
          {...register("category")}
          error={!!errors.category && touchedFields.category}
          helperText={errors.category?.message}
        />
        <TextField
          required
          margin="normal"
          id="votes"
          label="Votes"
          type="text"
          fullWidth
          {...register("votes")}
          error={!!errors.votes && touchedFields.votes}
          helperText={errors.votes?.message}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}>Cancel</Button>
        <Button disabled={!isValid} variant="contained" onClick={handleSubmit(onSubmit)}>Create</Button>
      </DialogActions>
    </Dialog>
  )
}

export default NewEntryDialog;