namespace project_coffee.Exceptions;

public class ProductUnvailableException : Exception
{
    public override string Message
    {
        get
        {
            return "Unavailable product.";
        }
    }
}