package uk.ac.ed.vfb.annotation.web;
import javax.mail.*;
import javax.mail.internet.*;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import uk.ac.ed.vfb.annotation.service.StackBeanManager;

import java.util.*;
/**
 * A simple email sender class.
 */
public class SimpleMailSender {
	private static final Log LOG = LogFactory.getLog(StackBeanManager.class);
	private static String SMTP_SERVER = "smtp.staffmail.ed.ac.uk";
	private static String FROM = "support@virtualflybrain.org";

	/**
	 * Main method to send a message given on the command line.
	 * java com.lotontech.mail.SimpleSender smtp.myISP.net bill@lotontech.com ben@lotontech.com "Hello" "Just to say Hello."
	 */
	public static void main(String args[])
	{
		try
		{
			String smtpServer=args[0];
			String to=args[1];
			String from=args[2];
			String subject=args[3];
			String body=args[4];
			send(smtpServer, to, from, subject, body);
		}
		catch (Exception ex)
		{
			System.out.println("Usage: java com.lotontech.mail.SimpleSender"
					+" smtpServer toAddress fromAddress subjectText bodyText");
		}
		System.exit(0);
	}

	/**
	 * "send" method using default server and from
	 */
	public static void send(String to, String subject, String body) {
		SimpleMailSender.send(SimpleMailSender.SMTP_SERVER, to, SimpleMailSender.FROM, subject, body);
	}

	
	/**
	 * "send" method to send the message.
	 */
	public static void send(String smtpServer, String to, String from, 
			String subject, String body) {
		try
		{
			Properties props = System.getProperties();
			// -- Attaching to default Session, or we could start a new one --
			props.put("mail.smtp.host", smtpServer);
			Session session = Session.getDefaultInstance(props, null);
			// -- Create a new message --
			Message msg = new MimeMessage(session);
			// -- Set the FROM and TO fields --
			msg.setFrom(new InternetAddress(from));
			msg.setRecipients(Message.RecipientType.TO,
					InternetAddress.parse(to, false));
			// -- We could include CC recipients too --
			// if (cc != null)
			// msg.setRecipients(Message.RecipientType.CC
			// ,InternetAddress.parse(cc, false));
			// -- Set the subject and body text --
			msg.setSubject(subject);
			msg.setText(body);
			// -- Set some other header information --
			msg.setSentDate(new Date());
			// -- Send the message --
			Transport.send(msg);
			LOG.debug("Message sent OK.");
		}
		catch (Exception ex)
		{
			ex.printStackTrace();
		}
	}
}
